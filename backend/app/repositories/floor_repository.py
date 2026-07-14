from sqlalchemy.orm import Session

from app.models.floor import Floor
from app.schemas.floor import FloorCreate, FloorUpdate


class FloorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Floor]:
        return (
            self.db.query(Floor)
            .order_by(Floor.floor_number.asc())
            .all()
        )

    def get_by_id(self, floor_id: int) -> Floor | None:
        return (
            self.db.query(Floor)
            .filter(Floor.id == floor_id)
            .first()
        )

    def get_by_code(self, floor_code: str) -> Floor | None:
        return (
            self.db.query(Floor)
            .filter(Floor.floor_code == floor_code)
            .first()
        )

    def create(self, floor: FloorCreate) -> Floor:
        db_floor = Floor(**floor.model_dump())

        self.db.add(db_floor)
        self.db.commit()
        self.db.refresh(db_floor)

        return db_floor

    def update(
        self,
        db_floor: Floor,
        floor: FloorUpdate,
    ) -> Floor:
        update_data = floor.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_floor, key, value)

        self.db.commit()
        self.db.refresh(db_floor)

        return db_floor

    def delete(self, db_floor: Floor) -> None:
        self.db.delete(db_floor)
        self.db.commit()