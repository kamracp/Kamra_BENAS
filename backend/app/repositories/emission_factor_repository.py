from datetime import date

from sqlalchemy.orm import Session

from app.models.emission_factor import EmissionFactor
from app.schemas.emission_factor import (
    EmissionFactorCreate,
    EmissionFactorUpdate,
)


class EmissionFactorRepository:
    """Global reference data — intentionally NOT tenant-scoped.

    Unlike every other repository in BENAS, there is no
    organization_id filter here: emission factors (CEA / DEFRA /
    IPCC) are published facts shared by all organizations.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        meter_type: str | None = None,
        region: str | None = None,
        include_inactive: bool = False,
    ) -> list[EmissionFactor]:
        query = self.db.query(EmissionFactor)

        if meter_type is not None:
            query = query.filter(EmissionFactor.meter_type == meter_type)

        if region is not None:
            query = query.filter(EmissionFactor.region == region)

        if not include_inactive:
            query = query.filter(EmissionFactor.is_active.is_(True))

        return (
            query
            .order_by(
                EmissionFactor.meter_type,
                EmissionFactor.valid_from.desc(),
            )
            .all()
        )

    def get_by_id(self, factor_id: int) -> EmissionFactor | None:
        return (
            self.db.query(EmissionFactor)
            .filter(EmissionFactor.id == factor_id)
            .first()
        )

    def find_applicable(
        self,
        meter_type: str,
        unit: str,
        on_date: date,
        region: str = "IN",
    ) -> EmissionFactor | None:
        """Return the factor valid on `on_date` for this meter type,
        unit and region.

        This is THE lookup the carbon engine uses for every bill:
        the bill's period must fall inside the factor's validity
        window (valid_to NULL = still open). If several match,
        the one with the latest valid_from wins.
        """
        return (
            self.db.query(EmissionFactor)
            .filter(
                EmissionFactor.meter_type == meter_type,
                EmissionFactor.unit == unit,
                EmissionFactor.region == region,
                EmissionFactor.is_active.is_(True),
                EmissionFactor.valid_from <= on_date,
                (
                    (EmissionFactor.valid_to.is_(None))
                    | (EmissionFactor.valid_to >= on_date)
                ),
            )
            .order_by(EmissionFactor.valid_from.desc())
            .first()
        )

    def create(self, factor: EmissionFactorCreate) -> EmissionFactor:
        db_factor = EmissionFactor(**factor.model_dump())

        self.db.add(db_factor)
        self.db.commit()
        self.db.refresh(db_factor)

        return db_factor

    def update(
        self,
        db_factor: EmissionFactor,
        factor: EmissionFactorUpdate,
    ) -> EmissionFactor:
        update_data = factor.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_factor, key, value)

        self.db.commit()
        self.db.refresh(db_factor)

        return db_factor

    def delete(self, db_factor: EmissionFactor) -> None:
        self.db.delete(db_factor)
        self.db.commit()
