from sqlalchemy.orm import Session

from app.models.manufacturing_unit import ManufacturingUnit
from app.schemas.manufacturing_unit import ManufacturingUnitCreate, ManufacturingUnitUpdate


class ManufacturingUnitRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(ManufacturingUnit).filter(
            ManufacturingUnit.organization_id == self.organization_id,
        )

    def get_all(self) -> list[ManufacturingUnit]:
        return self._base_query().order_by(ManufacturingUnit.unit_name.asc()).all()

    def get_by_id(self, unit_id: int) -> ManufacturingUnit | None:
        return self._base_query().filter(ManufacturingUnit.id == unit_id).first()

    def get_by_code(self, unit_code: str) -> ManufacturingUnit | None:
        return self._base_query().filter(ManufacturingUnit.unit_code == unit_code).first()

    def create(self, data: ManufacturingUnitCreate) -> ManufacturingUnit:
        db_unit = ManufacturingUnit(**data.model_dump(), organization_id=self.organization_id)
        self.db.add(db_unit)
        self.db.commit()
        self.db.refresh(db_unit)
        return db_unit

    def update(self, db_unit: ManufacturingUnit, data: ManufacturingUnitUpdate) -> ManufacturingUnit:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_unit, key, value)
        self.db.commit()
        self.db.refresh(db_unit)
        return db_unit

    def delete(self, db_unit: ManufacturingUnit) -> None:
        self.db.delete(db_unit)
        self.db.commit()
