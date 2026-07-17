from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.models.energy_meter import EnergyMeter
from app.repositories.building_repository import BuildingRepository
from app.repositories.energy_meter_repository import EnergyMeterRepository
from app.schemas.energy_meter import EnergyMeterCreate, EnergyMeterUpdate


class EnergyMeterService:
    def __init__(
        self,
        repository: EnergyMeterRepository,
        building_repository: BuildingRepository,
    ):
        self.repository = repository
        self.building_repository = building_repository

    def _ensure_building_exists(self, building_id: int) -> None:
        # BuildingRepository is tenant-scoped, so this also guarantees
        # the building belongs to the caller's organization.
        if self.building_repository.get_by_id(building_id) is None:
            raise ResourceNotFoundException("Building", building_id)

    def get_meters(
        self,
        building_id: int | None = None,
    ) -> list[EnergyMeter]:
        return self.repository.get_all(building_id=building_id)

    def get_meter(self, meter_id: int) -> EnergyMeter:
        meter = self.repository.get_by_id(meter_id)

        if meter is None:
            raise ResourceNotFoundException("Energy meter", meter_id)

        return meter

    def create_meter(self, meter: EnergyMeterCreate) -> EnergyMeter:
        self._ensure_building_exists(meter.building_id)

        existing = self.repository.get_by_code(meter.meter_code)

        if existing:
            raise DuplicateResourceException(
                "Energy meter", "meter_code", meter.meter_code,
            )

        return self.repository.create(meter)

    def update_meter(
        self,
        meter_id: int,
        meter: EnergyMeterUpdate,
    ) -> EnergyMeter:
        db_meter = self.repository.get_by_id(meter_id)

        if db_meter is None:
            raise ResourceNotFoundException("Energy meter", meter_id)

        if meter.building_id is not None:
            self._ensure_building_exists(meter.building_id)

        if (
            meter.meter_code
            and meter.meter_code != db_meter.meter_code
        ):
            existing = self.repository.get_by_code(meter.meter_code)

            if existing:
                raise DuplicateResourceException(
                    "Energy meter", "meter_code", meter.meter_code,
                )

        return self.repository.update(db_meter, meter)

    def delete_meter(self, meter_id: int) -> None:
        db_meter = self.repository.get_by_id(meter_id)

        if db_meter is None:
            raise ResourceNotFoundException("Energy meter", meter_id)

        self.repository.delete(db_meter)