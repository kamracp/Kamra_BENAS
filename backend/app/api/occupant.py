from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.occupant_repository import OccupantRepository
from app.schemas.occupant import (
    OccupantCreate,
    OccupantResponse,
    OccupantUpdate,
)
from app.services.occupant_service import OccupantService

router = APIRouter(
    prefix="/occupants",
    tags=["Occupants"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OccupantService:
    repository = OccupantRepository(
        db,
        organization_id=current_user.organization_id,
    )
    return OccupantService(repository)


@router.get(
    "/",
    response_model=list[OccupantResponse],
)
def get_all_occupants(
    building_id: int | None = None,
    floor_id: int | None = None,
    service: OccupantService = Depends(get_service),
):
    if floor_id is not None:
        return service.get_by_floor(floor_id)
    if building_id is not None:
        return service.get_by_building(building_id)
    return service.get_all()


@router.get(
    "/{occupant_id}",
    response_model=OccupantResponse,
)
def get_occupant(
    occupant_id: int,
    service: OccupantService = Depends(get_service),
):
    return service.get_by_id(occupant_id)


@router.post(
    "/",
    response_model=OccupantResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_occupant(
    occupant: OccupantCreate,
    service: OccupantService = Depends(get_service),
):
    return service.create(occupant)


@router.put(
    "/{occupant_id}",
    response_model=OccupantResponse,
    dependencies=[Depends(require_writer)],
)
def update_occupant(
    occupant_id: int,
    occupant: OccupantUpdate,
    service: OccupantService = Depends(get_service),
):
    return service.update(occupant_id, occupant)


@router.delete(
    "/{occupant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_occupant(
    occupant_id: int,
    service: OccupantService = Depends(get_service),
):
    service.delete(occupant_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)