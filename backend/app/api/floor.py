from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.floor_repository import FloorRepository
from app.schemas.floor import FloorCreate, FloorResponse, FloorUpdate
from app.services.floor_service import FloorService

router = APIRouter(
    prefix="/floors",
    tags=["Floors"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FloorService:
    repository = FloorRepository(
        db,
        organization_id=current_user.organization_id,
    )
    return FloorService(repository)


@router.get("/", response_model=list[FloorResponse])
def get_floors(
    building_id: int | None = Query(default=None),
    service: FloorService = Depends(get_service),
):
    return service.get_all(building_id)


@router.get("/{floor_id}", response_model=FloorResponse)
def get_floor(
    floor_id: int,
    service: FloorService = Depends(get_service),
):
    return service.get_by_id(floor_id)


@router.post(
    "/",
    response_model=FloorResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_floor(
    floor: FloorCreate,
    service: FloorService = Depends(get_service),
):
    return service.create(floor)


@router.put(
    "/{floor_id}",
    response_model=FloorResponse,
    dependencies=[Depends(require_writer)],
)
def update_floor(
    floor_id: int,
    floor: FloorUpdate,
    service: FloorService = Depends(get_service),
):
    return service.update(floor_id, floor)


@router.delete(
    "/{floor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_floor(
    floor_id: int,
    service: FloorService = Depends(get_service),
):
    service.delete(floor_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
