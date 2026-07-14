from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.floor_repository import FloorRepository
from app.schemas.floor import (
    FloorCreate,
    FloorResponse,
    FloorUpdate,
)
from app.services.floor_service import FloorService

router = APIRouter(
    prefix="/floors",
    tags=["Floors"],
)


def get_service(
    db: Session = Depends(get_db),
) -> FloorService:
    return FloorService(db)


@router.get(
    "/",
    response_model=list[FloorResponse],
)
def get_floors(
    service: FloorService = Depends(get_service),
):
    return service.get_all()


@router.get(
    "/{floor_id}",
    response_model=FloorResponse,
)
def get_floor(
    floor_id: int,
    service: FloorService = Depends(get_service),
):
    try:
        return service.get_by_id(floor_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.post(
    "/",
    response_model=FloorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_floor(
    floor: FloorCreate,
    service: FloorService = Depends(get_service),
):
    try:
        return service.create(floor)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.put(
    "/{floor_id}",
    response_model=FloorResponse,
)
def update_floor(
    floor_id: int,
    floor: FloorUpdate,
    service: FloorService = Depends(get_service),
):
    try:
        return service.update(
            floor_id,
            floor,
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
    "/{floor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_floor(
    floor_id: int,
    service: FloorService = Depends(get_service),
):
    try:
        service.delete(floor_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )