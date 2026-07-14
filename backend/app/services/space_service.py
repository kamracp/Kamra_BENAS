from app.models.space import Space
from app.repositories.space_repository import SpaceRepository
from app.schemas.space import (
    SpaceCreate,
    SpaceUpdate,
)


class SpaceService:
    def __init__(self, repository: SpaceRepository):
        self.repository = repository

    def get_spaces(self) -> list[Space]:
        return self.repository.get_all()

    def get_space(self, space_id: int) -> Space:
        space = self.repository.get_by_id(space_id)

        if space is None:
            raise ValueError(
                f"Space '{space_id}' was not found."
            )

        return space

    def create_space(
        self,
        space: SpaceCreate,
    ) -> Space:
        existing = self.repository.get_by_code(
            space.space_code
        )

        if existing:
            raise ValueError(
                f"Space code '{space.space_code}' already exists."
            )

        return self.repository.create(space)

    def update_space(
        self,
        space_id: int,
        space: SpaceUpdate,
    ) -> Space:
        db_space = self.repository.get_by_id(space_id)

        if db_space is None:
            raise ValueError(
                f"Space '{space_id}' was not found."
            )

        if (
            space.space_code
            and space.space_code != db_space.space_code
        ):
            existing = self.repository.get_by_code(
                space.space_code
            )

            if existing:
                raise ValueError(
                    f"Space code '{space.space_code}' already exists."
                )

        return self.repository.update(
            db_space,
            space,
        )

    def delete_space(
        self,
        space_id: int,
    ) -> None:
        db_space = self.repository.get_by_id(space_id)

        if db_space is None:
            raise ValueError(
                f"Space '{space_id}' was not found."
            )

        self.repository.delete(db_space)