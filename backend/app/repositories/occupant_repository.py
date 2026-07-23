from sqlalchemy.orm import Session
from app.models.occupant import Occupant
from app.schemas.occupant import OccupantCreate, OccupantUpdate


class OccupantRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(Occupant).filter(
            Occupant.organization_id == self.organization_id,
        )

    def get_all(self) -> list[Occupant]:
        return self._base_query().order_by(Occupant.name.asc()).all()

    def get_by_building(self, building_id: int) -> list[Occupant]:
        return (
            self._base_query()
            .filter(Occupant.building_id == building_id)
            .order_by(Occupant.name.asc())
            .all()
        )

    def get_by_floor(self, floor_id: int) -> list[Occupant]:
        return (
            self._base_query()
            .filter(Occupant.floor_id == floor_id)
            .order_by(Occupant.name.asc())
            .all()
        )

    def get_by_id(self, occupant_id: int) -> Occupant | None:
        return self._base_query().filter(Occupant.id == occupant_id).first()

    def create(self, occupant: OccupantCreate) -> Occupant:
        db_occupant = Occupant(
            **occupant.model_dump(),
            organization_id=self.organization_id,
        )
        self.db.add(db_occupant)
        self.db.commit()
        self.db.refresh(db_occupant)
        return db_occupant

    def update(
        self,
        db_occupant: Occupant,
        occupant: OccupantUpdate,
    ) -> Occupant:
        update_data = occupant.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_occupant, key, value)
        self.db.commit()
        self.db.refresh(db_occupant)
        return db_occupant

    def delete(self, db_occupant: Occupant) -> None:
        self.db.delete(db_occupant)
        self.db.commit()