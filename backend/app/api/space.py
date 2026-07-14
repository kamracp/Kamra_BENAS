from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.space_repository import SpaceRepository
from app.schemas.space import (
    SpaceCreate,
    SpaceResponse,
    SpaceUpdate,
)
from app.services.space_service import SpaceService

router = APIRouter(
    prefix="/spaces",
    tags=["Spaces"],
)


def get_service(db: Session = Depends(get_db)) -> SpaceService:
    repository = SpaceRepository(db)
    return SpaceService(repository)


@router.get(
    "/",
    response_model=list[SpaceResponse],
)
def get_spaces(
    service: SpaceService = Depends(get_service),
):
    return service.get_spaces()


@router.get(
    "/{space_id}",
    response_model=SpaceResponse,
)
def get_space(
    space_id: int,
    service: SpaceService = Depends(get_service),
):
    try:
        return service.get_space(space_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.post(
    "/",
    response_model=SpaceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_space(
    space: SpaceCreate,
    service: SpaceService = Depends(get_service),
):
    try:
        return service.create_space(space)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.put(
    "/{space_id}",
    response_model=SpaceResponse,
)
def update_space(
    space_id: int,
    space: SpaceUpdate,
    service: SpaceService = Depends(get_service),
):
    try:
        return service.update_space(
            space_id,
            space,
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
    "/{space_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_space(
    space_id: int,
    service: SpaceService = Depends(get_service),
):
    try:
        service.delete_space(space_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )