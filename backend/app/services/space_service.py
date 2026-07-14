from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.models.space import Space
from app.repositories.space_repository import SpaceRepository
from app.schemas.space import SpaceCreate, SpaceUpdate


class SpaceService:
    def __init__(self, repository: SpaceRepository):
        self.repository = repository

    def get_all(
        self,
        floor_id: int | None = None,
        building_id: int | None = None,
    ) -> list[Space]:
        return self.repository.get_all(floor_id, building_id)

    def get_by_id(self, space_id: int) -> Space:
        space = self.repository.get_by_id(space_id)

        if space is None:
            raise ResourceNotFoundException("Space", space_id)

        return space

    def create(self, space: SpaceCreate) -> Space:
        # Parent floor must belong to the same organization.
        # building_id is derived from the floor, never from the client.
        floor = self.repository.get_floor(space.floor_id)

        if floor is None:
            raise ResourceNotFoundException("Floor", space.floor_id)

        if self.repository.get_by_code(space.space_code):
            raise DuplicateResourceException(
                "Space", "space_code", space.space_code,
            )

        return self.repository.create(
            space,
            building_id=floor.building_id,
        )

    def update(self, space_id: int, space: SpaceUpdate) -> Space:
        db_space = self.get_by_id(space_id)

        if space.space_code and space.space_code != db_space.space_code:
            if self.repository.get_by_code(space.space_code):
                raise DuplicateResourceException(
                    "Space", "space_code", space.space_code,
                )

        return self.repository.update(db_space, space)

    def delete(self, space_id: int) -> None:
        db_space = self.get_by_id(space_id)
        self.repository.delete(db_space)
