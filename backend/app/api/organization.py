from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
    OrganizationUpdate,
)
from app.services.organization_service import (
    organization_service,
)

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)


@router.get(
    "/",
    response_model=list[OrganizationResponse],
)
def get_organizations(
    db: Session = Depends(get_db),
):
    return organization_service.get_all(db)


@router.get(
    "/{organization_id}",
    response_model=OrganizationResponse,
)
def get_organization(
    organization_id: int,
    db: Session = Depends(get_db),
):
    return organization_service.get_by_id(
        db,
        organization_id,
    )


@router.post(
    "/",
    response_model=OrganizationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_organization(
    payload: OrganizationCreate,
    db: Session = Depends(get_db),
):
    return organization_service.create(
        db,
        payload,
    )


@router.put(
    "/{organization_id}",
    response_model=OrganizationResponse,
)
def update_organization(
    organization_id: int,
    payload: OrganizationUpdate,
    db: Session = Depends(get_db),
):
    return organization_service.update(
        db,
        organization_id,
        payload,
    )


@router.delete(
    "/{organization_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_organization(
    organization_id: int,
    db: Session = Depends(get_db),
):
    organization_service.delete(
        db,
        organization_id,
    )

    return None