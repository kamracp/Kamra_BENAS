from app.core.exceptions import DuplicateResourceException, ResourceNotFoundException
from app.repositories.manufacturing_unit_repository import ManufacturingUnitRepository
from app.schemas.manufacturing_unit import (
    ManufacturingUnitCreate,
    ManufacturingUnitResponse,
    ManufacturingUnitUpdate,
)


class ManufacturingUnitService:
    def __init__(self, repository: ManufacturingUnitRepository):
        self.repository = repository

    def get_all(self) -> list[ManufacturingUnitResponse]:
        return [ManufacturingUnitResponse.model_validate(u) for u in self.repository.get_all()]

    def get_by_id(self, unit_id: int) -> ManufacturingUnitResponse:
        unit = self.repository.get_by_id(unit_id)
        if not unit:
            raise ResourceNotFoundException("Manufacturing Unit", unit_id)
        return ManufacturingUnitResponse.model_validate(unit)

    def create(self, data: ManufacturingUnitCreate) -> ManufacturingUnitResponse:
        if self.repository.get_by_code(data.unit_code):
            raise DuplicateResourceException("Manufacturing Unit", "unit_code", data.unit_code)
        unit = self.repository.create(data)
        return ManufacturingUnitResponse.model_validate(unit)

    def update(self, unit_id: int, data: ManufacturingUnitUpdate) -> ManufacturingUnitResponse:
        unit = self.repository.get_by_id(unit_id)
        if not unit:
            raise ResourceNotFoundException("Manufacturing Unit", unit_id)
        updated = self.repository.update(unit, data)
        return ManufacturingUnitResponse.model_validate(updated)

    def delete(self, unit_id: int) -> None:
        unit = self.repository.get_by_id(unit_id)
        if not unit:
            raise ResourceNotFoundException("Manufacturing Unit", unit_id)
        self.repository.delete(unit)
