from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.models.hvac_equipment import HvacEquipment
from app.repositories.hvac_equipment_repository import HvacEquipmentRepository
from app.schemas.hvac_equipment import (
    HvacEquipmentCreate,
    HvacEquipmentResponse,
    HvacEquipmentUpdate,
)


def calculate_monthly_energy_kwh(equipment: HvacEquipment) -> float:
    """ASHRAE-standard estimate: electrical energy drawn to deliver
    the equipment's rated cooling load over its stated run schedule.

    Energy (kWh/month) = (Capacity_kW / COP) x Hours/day x Days/month

    Capacity_kW is thermal cooling capacity; dividing by COP converts
    it to electrical input power, which is then multiplied by the
    actual runtime to give energy consumed.
    """
    electrical_kw = float(equipment.capacity_kw) / float(equipment.cop)
    return round(
        electrical_kw
        * float(equipment.operating_hours_per_day)
        * equipment.operating_days_per_month,
        2,
    )


def _to_response(equipment: HvacEquipment) -> HvacEquipmentResponse:
    return HvacEquipmentResponse(
        **{
            column.name: getattr(equipment, column.name)
            for column in equipment.__table__.columns
        },
        estimated_monthly_energy_kwh=calculate_monthly_energy_kwh(equipment),
    )


class HvacEquipmentService:
    def __init__(self, repository: HvacEquipmentRepository):
        self.repository = repository

    def get_all(self) -> list[HvacEquipmentResponse]:
        return [_to_response(e) for e in self.repository.get_all()]

    def get_by_building(self, building_id: int) -> list[HvacEquipmentResponse]:
        return [
            _to_response(e)
            for e in self.repository.get_by_building(building_id)
        ]

    def get_by_id(self, equipment_id: int) -> HvacEquipmentResponse:
        equipment = self.repository.get_by_id(equipment_id)
        if not equipment:
            raise ResourceNotFoundException("HVAC Equipment", equipment_id)
        return _to_response(equipment)

    def create(self, data: HvacEquipmentCreate) -> HvacEquipmentResponse:
        if self.repository.get_by_code(data.equipment_code):
            raise DuplicateResourceException(
                "HVAC Equipment", "equipment_code", data.equipment_code,
            )
        equipment = self.repository.create(data)
        return _to_response(equipment)

    def update(
        self,
        equipment_id: int,
        data: HvacEquipmentUpdate,
    ) -> HvacEquipmentResponse:
        equipment = self.repository.get_by_id(equipment_id)
        if not equipment:
            raise ResourceNotFoundException("HVAC Equipment", equipment_id)
        updated = self.repository.update(equipment, data)
        return _to_response(updated)

    def delete(self, equipment_id: int) -> None:
        equipment = self.repository.get_by_id(equipment_id)
        if not equipment:
            raise ResourceNotFoundException("HVAC Equipment", equipment_id)
        self.repository.delete(equipment)
