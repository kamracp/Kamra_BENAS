from sqlalchemy.orm import Session

from app.models.space import Space
from app.schemas.space import SpaceCreate, SpaceUpdate


class SpaceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Space]:
        return (
            self.db.query(Space)
            .order_by(Space.space_name.asc())
            .all()
        )

    def get_by_id(self, space_id: int) -> Space | None:
        return (
            self.db.query(Space)
            .filter(Space.id == space_id)
            .first()
        )

    def get_by_code(self, space_code: str) -> Space | None:
        return (
            self.db.query(Space)
            .filter(Space.space_code == space_code)
            .first()
        )

    def create(self, space: SpaceCreate) -> Space:
        db_space = Space(**space.model_dump())

        self.db.add(db_space)
        self.db.commit()
        self.db.refresh(db_space)

        return db_space

    def update(
        self,
        db_space: Space,
        space: SpaceUpdate,
    ) -> Space:
        update_data = space.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_space, key, value)

        self.db.commit()
        self.db.refresh(db_space)

        return db_space

    def delete(self, db_space: Space) -> None:
        self.db.delete(db_space)
        self.db.commit()