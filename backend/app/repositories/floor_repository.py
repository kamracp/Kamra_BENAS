from sqlalchemy.orm import Session

from app.models.building import Building
from app.models.floor import Floor
from app.schemas.floor import FloorCreate, FloorUpdate


class FloorRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(Floor).filter(
            Floor.organization_id == self.organization_id,
        )

    def get_all(self, building_id: int | None = None) -> list[Floor]:
        query = self._base_query()

        if building_id is not None:
            query = query.filter(Floor.building_id == building_id)

        return query.order_by(Floor.floor_number.asc()).all()

    def get_by_id(self, floor_id: int) -> Floor | None:
        return (
            self._base_query()
            .filter(Floor.id == floor_id)
            .first()
        )

    def get_by_code(self, floor_code: str) -> Floor | None:
        return (
            self._base_query()
            .filter(Floor.floor_code == floor_code)
            .first()
        )

    def get_building(self, building_id: int) -> Building | None:
        """Fetch a building only if it belongs to this organization."""
        return (
            self.db.query(Building)
            .filter(
                Building.organization_id == self.organization_id,
                Building.id == building_id,
            )
            .first()
        )

    def create(self, floor: FloorCreate) -> Floor:
        db_floor = Floor(
            **floor.model_dump(),
            organization_id=self.organization_id,
        )

        self.db.add(db_floor)
        self.db.commit()
        self.db.refresh(db_floor)

        return db_floor

    def update(self, db_floor: Floor, floor: FloorUpdate) -> Floor:
        update_data = floor.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_floor, key, value)

        self.db.commit()
        self.db.refresh(db_floor)

        return db_floor

    def delete(self, db_floor: Floor) -> None:
        self.db.delete(db_floor)
        self.db.commit()
