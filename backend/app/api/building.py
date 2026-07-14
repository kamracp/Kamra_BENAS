from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.building_repository import BuildingRepository
from app.schemas.building import (
    BuildingCreate,
    BuildingResponse,
    BuildingUpdate,
)
from app.services.building_service import BuildingService

router = APIRouter(
    prefix="/buildings",
    tags=["Buildings"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BuildingService:
    repository = BuildingRepository(
        db,
        organization_id=current_user.organization_id,
    )
    return BuildingService(repository)


@router.get(
    "/",
    response_model=list[BuildingResponse],
)
def get_buildings(
    service: BuildingService = Depends(get_service),
):
    return service.get_buildings()


@router.get(
    "/{building_id}",
    response_model=BuildingResponse,
)
def get_building(
    building_id: int,
    service: BuildingService = Depends(get_service),
):
    return service.get_building(building_id)


@router.post(
    "/",
    response_model=BuildingResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_building(
    building: BuildingCreate,
    service: BuildingService = Depends(get_service),
):
    return service.create_building(building)


@router.put(
    "/{building_id}",
    response_model=BuildingResponse,
    dependencies=[Depends(require_writer)],
)
def update_building(
    building_id: int,
    building: BuildingUpdate,
    service: BuildingService = Depends(get_service),
):
    return service.update_building(building_id, building)


@router.delete(
    "/{building_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_building(
    building_id: int,
    service: BuildingService = Depends(get_service),
):
    service.delete_building(building_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
