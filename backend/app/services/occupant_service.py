from app.core.exceptions import ResourceNotFoundException
from app.models.occupant import Occupant
from app.repositories.occupant_repository import OccupantRepository
from app.schemas.occupant import (
    OccupantCreate,
    OccupantResponse,
    OccupantUpdate,
)


def _to_response(occupant: Occupant) -> OccupantResponse:
    return OccupantResponse(
        **{
            column.name: getattr(occupant, column.name)
            for column in occupant.__table__.columns
        }
    )


class OccupantService:
    def __init__(self, repository: OccupantRepository):
        self.repository = repository

    def get_all(self) -> list[OccupantResponse]:
        return [_to_response(o) for o in self.repository.get_all()]

    def get_by_building(self, building_id: int) -> list[OccupantResponse]:
        return [
            _to_response(o)
            for o in self.repository.get_by_building(building_id)
        ]

    def get_by_floor(self, floor_id: int) -> list[OccupantResponse]:
        return [
            _to_response(o) for o in self.repository.get_by_floor(floor_id)
        ]

    def get_by_id(self, occupant_id: int) -> OccupantResponse:
        occupant = self.repository.get_by_id(occupant_id)
        if not occupant:
            raise ResourceNotFoundException("Occupant", occupant_id)
        return _to_response(occupant)

    def create(self, data: OccupantCreate) -> OccupantResponse:
        occupant = self.repository.create(data)
        return _to_response(occupant)

    def update(
        self,
        occupant_id: int,
        data: OccupantUpdate,
    ) -> OccupantResponse:
        occupant = self.repository.get_by_id(occupant_id)
        if not occupant:
            raise ResourceNotFoundException("Occupant", occupant_id)
        updated = self.repository.update(occupant, data)
        return _to_response(updated)

    def delete(self, occupant_id: int) -> None:
        occupant = self.repository.get_by_id(occupant_id)
        if not occupant:
            raise ResourceNotFoundException("Occupant", occupant_id)
        self.repository.delete(occupant)