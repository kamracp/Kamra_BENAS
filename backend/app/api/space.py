from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.space_repository import SpaceRepository
from app.schemas.space import SpaceCreate, SpaceResponse, SpaceUpdate
from app.services.space_service import SpaceService

router = APIRouter(
    prefix="/spaces",
    tags=["Spaces"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SpaceService:
    repository = SpaceRepository(
        db,
        organization_id=current_user.organization_id,
    )
    return SpaceService(repository)


@router.get("/", response_model=list[SpaceResponse])
def get_spaces(
    floor_id: int | None = Query(default=None),
    building_id: int | None = Query(default=None),
    service: SpaceService = Depends(get_service),
):
    return service.get_all(floor_id, building_id)


@router.get("/{space_id}", response_model=SpaceResponse)
def get_space(
    space_id: int,
    service: SpaceService = Depends(get_service),
):
    return service.get_by_id(space_id)


@router.post(
    "/",
    response_model=SpaceResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_space(
    space: SpaceCreate,
    service: SpaceService = Depends(get_service),
):
    return service.create(space)


@router.put(
    "/{space_id}",
    response_model=SpaceResponse,
    dependencies=[Depends(require_writer)],
)
def update_space(
    space_id: int,
    space: SpaceUpdate,
    service: SpaceService = Depends(get_service),
):
    return service.update(space_id, space)


@router.delete(
    "/{space_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_space(
    space_id: int,
    service: SpaceService = Depends(get_service),
):
    service.delete(space_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
