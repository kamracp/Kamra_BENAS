from datetime import date

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.emission_factor import EmissionFactor
from app.repositories.emission_factor_repository import (
    EmissionFactorRepository,
)
from app.schemas.emission_factor import (
    EmissionFactorCreate,
    EmissionFactorUpdate,
)


class EmissionFactorService:
    """Business rules for the global emission factor library.

    Twin rule of utility bills' overlap check: two ACTIVE factors for
    the same (meter_type, unit, region) must never have overlapping
    validity windows — otherwise one bill would have two possible
    answers, and the audit trail would be ambiguous.
    """

    def __init__(self, repository: EmissionFactorRepository):
        self.repository = repository

    @staticmethod
    def _windows_overlap(
        a_from: date,
        a_to: date | None,
        b_from: date,
        b_to: date | None,
    ) -> bool:
        # An open window (to = None) extends to infinity.
        a_end_open = a_to is None
        b_end_open = b_to is None

        starts_before_b_ends = b_end_open or a_from <= b_to
        b_starts_before_a_ends = a_end_open or b_from <= a_to

        return starts_before_b_ends and b_starts_before_a_ends

    def _ensure_no_window_overlap(
        self,
        meter_type: str,
        unit: str,
        region: str,
        valid_from: date,
        valid_to: date | None,
        exclude_factor_id: int | None = None,
    ) -> None:
        # Factor table is small (reference data), so an in-Python
        # check over the filtered list is simple and clear.
        candidates = self.repository.get_all(
            meter_type=meter_type,
            region=region,
            include_inactive=False,
        )

        for existing in candidates:
            if exclude_factor_id is not None and existing.id == exclude_factor_id:
                continue

            if existing.unit != unit:
                continue

            if self._windows_overlap(
                valid_from,
                valid_to,
                existing.valid_from,
                existing.valid_to,
            ):
                raise ConflictException(
                    "An active factor for this meter type, unit and "
                    f"region already covers {existing.valid_from} to "
                    f"{existing.valid_to or 'open-ended'} "
                    f"(source: {existing.source}). Overlapping validity "
                    "windows are not allowed — one bill would have two "
                    "possible factors.",
                )

    def get_factors(
        self,
        meter_type: str | None = None,
        region: str | None = None,
        include_inactive: bool = False,
    ) -> list[EmissionFactor]:
        return self.repository.get_all(
            meter_type=meter_type,
            region=region,
            include_inactive=include_inactive,
        )

    def get_factor(self, factor_id: int) -> EmissionFactor:
        factor = self.repository.get_by_id(factor_id)

        if factor is None:
            raise ResourceNotFoundException("Emission factor", factor_id)

        return factor

    def get_applicable_factor(
        self,
        meter_type: str,
        unit: str,
        on_date: date,
        region: str = "IN",
    ) -> EmissionFactor:
        """The carbon engine's lookup: which factor applies on this date?"""
        factor = self.repository.find_applicable(
            meter_type=meter_type,
            unit=unit,
            on_date=on_date,
            region=region,
        )

        if factor is None:
            raise ResourceNotFoundException(
                "Emission factor for "
                f"{meter_type}/{unit}/{region} on {on_date}",
                None,
            )

        return factor

    def create_factor(self, factor: EmissionFactorCreate) -> EmissionFactor:
        if factor.is_active:
            self._ensure_no_window_overlap(
                meter_type=factor.meter_type,
                unit=factor.unit,
                region=factor.region,
                valid_from=factor.valid_from,
                valid_to=factor.valid_to,
            )

        return self.repository.create(factor)

    def update_factor(
        self,
        factor_id: int,
        factor: EmissionFactorUpdate,
    ) -> EmissionFactor:
        db_factor = self.repository.get_by_id(factor_id)

        if db_factor is None:
            raise ResourceNotFoundException("Emission factor", factor_id)

        # Effective values after applying the partial update.
        update_data = factor.model_dump(exclude_unset=True)

        new_from = update_data.get("valid_from", db_factor.valid_from)
        new_to = update_data.get("valid_to", db_factor.valid_to)
        new_type = update_data.get("meter_type", db_factor.meter_type)
        new_unit = update_data.get("unit", db_factor.unit)
        new_region = update_data.get("region", db_factor.region)
        new_active = update_data.get("is_active", db_factor.is_active)

        if new_to is not None and new_to < new_from:
            raise ConflictException(
                "valid_to cannot be before valid_from.",
            )

        if new_active:
            self._ensure_no_window_overlap(
                meter_type=new_type,
                unit=new_unit,
                region=new_region,
                valid_from=new_from,
                valid_to=new_to,
                exclude_factor_id=db_factor.id,
            )

        return self.repository.update(db_factor, factor)

    def delete_factor(self, factor_id: int) -> None:
        db_factor = self.repository.get_by_id(factor_id)

        if db_factor is None:
            raise ResourceNotFoundException("Emission factor", factor_id)

        self.repository.delete(db_factor)
