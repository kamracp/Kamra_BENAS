from sqlalchemy.orm import Session

from app.models.production_record import ProductionRecord
from app.schemas.production_record import ProductionRecordCreate, ProductionRecordUpdate


class ProductionRecordRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(ProductionRecord).filter(
            ProductionRecord.organization_id == self.organization_id,
        )

    def get_all(self) -> list[ProductionRecord]:
        return self._base_query().order_by(ProductionRecord.period_start.asc()).all()

    def get_by_unit(self, manufacturing_unit_id: int) -> list[ProductionRecord]:
        return (
            self._base_query()
            .filter(ProductionRecord.manufacturing_unit_id == manufacturing_unit_id)
            .order_by(ProductionRecord.period_start.asc())
            .all()
        )

    def get_by_id(self, record_id: int) -> ProductionRecord | None:
        return self._base_query().filter(ProductionRecord.id == record_id).first()

    def create(self, data: ProductionRecordCreate) -> ProductionRecord:
        db_record = ProductionRecord(**data.model_dump(), organization_id=self.organization_id)
        self.db.add(db_record)
        self.db.commit()
        self.db.refresh(db_record)
        return db_record

    def update(self, db_record: ProductionRecord, data: ProductionRecordUpdate) -> ProductionRecord:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_record, key, value)
        self.db.commit()
        self.db.refresh(db_record)
        return db_record

    def delete(self, db_record: ProductionRecord) -> None:
        self.db.delete(db_record)
        self.db.commit()
