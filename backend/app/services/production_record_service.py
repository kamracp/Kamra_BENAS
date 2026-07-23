from app.core.exceptions import ResourceNotFoundException
from app.repositories.production_record_repository import ProductionRecordRepository
from app.schemas.production_record import (
    ProductionRecordCreate,
    ProductionRecordResponse,
    ProductionRecordUpdate,
)


class ProductionRecordService:
    def __init__(self, repository: ProductionRecordRepository):
        self.repository = repository

    def get_all(self) -> list[ProductionRecordResponse]:
        return [ProductionRecordResponse.model_validate(r) for r in self.repository.get_all()]

    def get_by_unit(self, manufacturing_unit_id: int) -> list[ProductionRecordResponse]:
        return [
            ProductionRecordResponse.model_validate(r)
            for r in self.repository.get_by_unit(manufacturing_unit_id)
        ]

    def get_by_id(self, record_id: int) -> ProductionRecordResponse:
        record = self.repository.get_by_id(record_id)
        if not record:
            raise ResourceNotFoundException("Production Record", record_id)
        return ProductionRecordResponse.model_validate(record)

    def create(self, data: ProductionRecordCreate) -> ProductionRecordResponse:
        record = self.repository.create(data)
        return ProductionRecordResponse.model_validate(record)

    def update(self, record_id: int, data: ProductionRecordUpdate) -> ProductionRecordResponse:
        record = self.repository.get_by_id(record_id)
        if not record:
            raise ResourceNotFoundException("Production Record", record_id)
        updated = self.repository.update(record, data)
        return ProductionRecordResponse.model_validate(updated)

    def delete(self, record_id: int) -> None:
        record = self.repository.get_by_id(record_id)
        if not record:
            raise ResourceNotFoundException("Production Record", record_id)
        self.repository.delete(record)
