from sqlalchemy.orm import Session

from app.models.floor import Floor
from app.models.space import Space
from app.schemas.space import SpaceCreate, SpaceUpdate


class SpaceRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(Space).filter(
            Space.organization_id == self.organization_id,
        )

    def get_all(
        self,
        floor_id: int | None = None,
        building_id: int | None = None,
    ) -> list[Space]:
        query = self._base_query()

        if floor_id is not None:
            query = query.filter(Space.floor_id == floor_id)

        if building_id is not None:
            query = query.filter(Space.building_id == building_id)

        return query.order_by(Space.space_name.asc()).all()

    def get_by_id(self, space_id: int) -> Space | None:
        return (
            self._base_query()
            .filter(Space.id == space_id)
            .first()
        )

    def get_by_code(self, space_code: str) -> Space | None:
        return (
            self._base_query()
            .filter(Space.space_code == space_code)
            .first()
        )

    def get_floor(self, floor_id: int) -> Floor | None:
        """Fetch a floor only if it belongs to this organization."""
        return (
            self.db.query(Floor)
            .filter(
                Floor.organization_id == self.organization_id,
                Floor.id == floor_id,
            )
            .first()
        )

    def create(self, space: SpaceCreate, building_id: int) -> Space:
        db_space = Space(
            **space.model_dump(),
            organization_id=self.organization_id,
            building_id=building_id,
        )

        self.db.add(db_space)
        self.db.commit()
        self.db.refresh(db_space)

        return db_space

    def update(self, db_space: Space, space: SpaceUpdate) -> Space:
        update_data = space.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_space, key, value)

        self.db.commit()
        self.db.refresh(db_space)

        return db_space

    def delete(self, db_space: Space) -> None:
        self.db.delete(db_space)
        self.db.commit()
