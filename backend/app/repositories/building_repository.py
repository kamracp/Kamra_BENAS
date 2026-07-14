from sqlalchemy.orm import Session

from app.models.building import Building
from app.schemas.building import BuildingCreate, BuildingUpdate


class BuildingRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(Building).filter(
            Building.organization_id == self.organization_id,
        )

    def get_all(self) -> list[Building]:
        return (
            self._base_query()
            .order_by(Building.building_name.asc())
            .all()
        )

    def get_by_id(self, building_id: int) -> Building | None:
        return (
            self._base_query()
            .filter(Building.id == building_id)
            .first()
        )

    def get_by_code(self, building_code: str) -> Building | None:
        return (
            self._base_query()
            .filter(Building.building_code == building_code)
            .first()
        )

    def create(self, building: BuildingCreate) -> Building:
        db_building = Building(
            **building.model_dump(),
            organization_id=self.organization_id,
        )

        self.db.add(db_building)
        self.db.commit()
        self.db.refresh(db_building)

        return db_building

    def update(
        self,
        db_building: Building,
        building: BuildingUpdate,
    ) -> Building:
        update_data = building.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_building, key, value)

        self.db.commit()
        self.db.refresh(db_building)

        return db_building

    def delete(self, db_building: Building) -> None:
        self.db.delete(db_building)
        self.db.commit()
