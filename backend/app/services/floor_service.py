from sqlalchemy.orm import Session

from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.repositories.floor_repository import FloorRepository
from app.schemas.floor import FloorCreate, FloorUpdate


class FloorService:
    def __init__(self, db: Session):
        self.repository = FloorRepository(db)

    def get_all(self):
        return self.repository.get_all()

    def get_by_id(self, floor_id: int):
        floor = self.repository.get_by_id(floor_id)

        if not floor:
            raise ResourceNotFoundException("Floor not found.")

        return floor

    def create(self, floor: FloorCreate):
        existing = self.repository.get_by_code(
            floor.floor_code
        )

        if existing:
            raise DuplicateResourceException(
                "Floor code already exists."
            )

        return self.repository.create(floor)

    def update(
        self,
        floor_id: int,
        floor: FloorUpdate,
    ):
        db_floor = self.repository.get_by_id(
            floor_id
        )

        if not db_floor:
            raise ResourceNotFoundException(
                "Floor not found."
            )

        return self.repository.update(
            db_floor,
            floor,
        )

    def delete(self, floor_id: int):
        db_floor = self.repository.get_by_id(
            floor_id
        )

        if not db_floor:
            raise ResourceNotFoundException(
                "Floor not found."
            )

        self.repository.delete(db_floor)