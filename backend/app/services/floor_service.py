from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.models.floor import Floor
from app.repositories.floor_repository import FloorRepository
from app.schemas.floor import FloorCreate, FloorUpdate


class FloorService:
    def __init__(self, repository: FloorRepository):
        self.repository = repository

    def get_all(self, building_id: int | None = None) -> list[Floor]:
        return self.repository.get_all(building_id)

    def get_by_id(self, floor_id: int) -> Floor:
        floor = self.repository.get_by_id(floor_id)

        if floor is None:
            raise ResourceNotFoundException("Floor", floor_id)

        return floor

    def create(self, floor: FloorCreate) -> Floor:
        # Parent building must belong to the same organization
        building = self.repository.get_building(floor.building_id)

        if building is None:
            raise ResourceNotFoundException("Building", floor.building_id)

        if self.repository.get_by_code(floor.floor_code):
            raise DuplicateResourceException(
                "Floor", "floor_code", floor.floor_code,
            )

        return self.repository.create(floor)

    def update(self, floor_id: int, floor: FloorUpdate) -> Floor:
        db_floor = self.get_by_id(floor_id)

        if floor.floor_code and floor.floor_code != db_floor.floor_code:
            if self.repository.get_by_code(floor.floor_code):
                raise DuplicateResourceException(
                    "Floor", "floor_code", floor.floor_code,
                )

        return self.repository.update(db_floor, floor)

    def delete(self, floor_id: int) -> None:
        db_floor = self.get_by_id(floor_id)
        self.repository.delete(db_floor)
