from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
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


def get_service(db: Session = Depends(get_db)) -> BuildingService:
    repository = BuildingRepository(db)
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
    try:
        return service.get_building(building_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.post(
    "/",
    response_model=BuildingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_building(
    building: BuildingCreate,
    service: BuildingService = Depends(get_service),
):
    try:
        return service.create_building(building)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.put(
    "/{building_id}",
    response_model=BuildingResponse,
)
def update_building(
    building_id: int,
    building: BuildingUpdate,
    service: BuildingService = Depends(get_service),
):
    try:
        return service.update_building(
            building_id,
            building,
        )
    except ValueError as exc:
        message = str(exc)

        status_code = (
            status.HTTP_404_NOT_FOUND
            if "not found" in message.lower()
            else status.HTTP_400_BAD_REQUEST
        )

        raise HTTPException(
            status_code=status_code,
            detail=message,
        ) from exc


@router.delete(
    "/{building_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_building(
    building_id: int,
    service: BuildingService = Depends(get_service),
):
    try:
        service.delete_building(building_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return Response(status_code=status.HTTP_204_NO_CONTENT)