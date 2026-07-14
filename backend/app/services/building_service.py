from app.models.building import Building
from app.repositories.building_repository import BuildingRepository
from app.schemas.building import BuildingCreate, BuildingUpdate


class BuildingService:
    def __init__(self, repository: BuildingRepository):
        self.repository = repository

    def get_buildings(self) -> list[Building]:
        return self.repository.get_all()

    def get_building(self, building_id: int) -> Building:
        building = self.repository.get_by_id(building_id)

        if building is None:
            raise ValueError(f"Building '{building_id}' was not found.")

        return building

    def create_building(self, building: BuildingCreate) -> Building:
        existing = self.repository.get_by_code(building.building_code)

        if existing:
            raise ValueError(
                f"Building code '{building.building_code}' already exists."
            )

        return self.repository.create(building)

    def update_building(
        self,
        building_id: int,
        building: BuildingUpdate,
    ) -> Building:
        db_building = self.repository.get_by_id(building_id)

        if db_building is None:
            raise ValueError(f"Building '{building_id}' was not found.")

        if (
            building.building_code
            and building.building_code != db_building.building_code
        ):
            existing = self.repository.get_by_code(building.building_code)

            if existing:
                raise ValueError(
                    f"Building code '{building.building_code}' already exists."
                )

        return self.repository.update(db_building, building)

    def delete_building(self, building_id: int) -> None:
        db_building = self.repository.get_by_id(building_id)

        if db_building is None:
            raise ValueError(f"Building '{building_id}' was not found.")

        self.repository.delete(db_building)