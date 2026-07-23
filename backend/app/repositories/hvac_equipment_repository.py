from sqlalchemy.orm import Session

from app.models.hvac_equipment import HvacEquipment
from app.schemas.hvac_equipment import HvacEquipmentCreate, HvacEquipmentUpdate


class HvacEquipmentRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(HvacEquipment).filter(
            HvacEquipment.organization_id == self.organization_id,
        )

    def get_all(self) -> list[HvacEquipment]:
        return (
            self._base_query()
            .order_by(HvacEquipment.equipment_name.asc())
            .all()
        )

    def get_by_building(self, building_id: int) -> list[HvacEquipment]:
        return (
            self._base_query()
            .filter(HvacEquipment.building_id == building_id)
            .order_by(HvacEquipment.equipment_name.asc())
            .all()
        )

    def get_by_id(self, equipment_id: int) -> HvacEquipment | None:
        return (
            self._base_query()
            .filter(HvacEquipment.id == equipment_id)
            .first()
        )

    def get_by_code(self, equipment_code: str) -> HvacEquipment | None:
        return (
            self._base_query()
            .filter(HvacEquipment.equipment_code == equipment_code)
            .first()
        )

    def create(self, equipment: HvacEquipmentCreate) -> HvacEquipment:
        db_equipment = HvacEquipment(
            **equipment.model_dump(),
            organization_id=self.organization_id,
        )
        self.db.add(db_equipment)
        self.db.commit()
        self.db.refresh(db_equipment)
        return db_equipment

    def update(
        self,
        db_equipment: HvacEquipment,
        equipment: HvacEquipmentUpdate,
    ) -> HvacEquipment:
        update_data = equipment.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_equipment, key, value)
        self.db.commit()
        self.db.refresh(db_equipment)
        return db_equipment

    def delete(self, db_equipment: HvacEquipment) -> None:
        self.db.delete(db_equipment)
        self.db.commit()
