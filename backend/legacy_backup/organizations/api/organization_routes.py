from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.organizations.schemas.organization_schema import (
    OrganizationCreate,
    OrganizationResponse,
    OrganizationUpdate,
)
from app.organizations.services.organization_service import (
    OrganizationService,
)

router = APIRouter()


@router.get(
    "",
    response_model=List[OrganizationResponse],
    status_code=status.HTTP_200_OK,
)
def get_organizations(
    db: Session = Depends(get_db),
):
    return OrganizationService.get_all(db)


@router.get(
    "/{organization_id}",
    response_model=OrganizationResponse,
    status_code=status.HTTP_200_OK,
)
def get_organization(
    organization_id: int,
    db: Session = Depends(get_db),
):
    return OrganizationService.get_by_id(
        db,
        organization_id,
    )


@router.post(
    "",
    response_model=OrganizationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_organization(
    organization: OrganizationCreate,
    db: Session = Depends(get_db),
):
    return OrganizationService.create(
        db,
        organization,
    )


@router.put(
    "/{organization_id}",
    response_model=OrganizationResponse,
    status_code=status.HTTP_200_OK,
)
def update_organization(
    organization_id: int,
    organization: OrganizationUpdate,
    db: Session = Depends(get_db),
):
    return OrganizationService.update(
        db,
        organization_id,
        organization,
    )


@router.delete(
    "/{organization_id}",
    status_code=status.HTTP_200_OK,
)
def delete_organization(
    organization_id: int,
    db: Session = Depends(get_db),
):
    return OrganizationService.delete(
        db,
        organization_id,
    )