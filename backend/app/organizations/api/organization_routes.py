from fastapi import APIRouter, Depends, HTTPException, status
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

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)


@router.get("/", response_model=list[OrganizationResponse])
def get_organizations(
    db: Session = Depends(get_db),
):
    return OrganizationService.get_all(db)


@router.get("/{organization_id}", response_model=OrganizationResponse)
def get_organization(
    organization_id: int,
    db: Session = Depends(get_db),
):
    organization = OrganizationService.get_by_id(
        db,
        organization_id,
    )

    if organization is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    return organization


@router.post(
    "/",
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
)
def update_organization(
    organization_id: int,
    organization: OrganizationUpdate,
    db: Session = Depends(get_db),
):
    db_object = OrganizationService.get_by_id(
        db,
        organization_id,
    )

    if db_object is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    return OrganizationService.update(
        db,
        db_object,
        organization,
    )


@router.delete(
    "/{organization_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_organization(
    organization_id: int,
    db: Session = Depends(get_db),
):
    db_object = OrganizationService.get_by_id(
        db,
        organization_id,
    )

    if db_object is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    OrganizationService.delete(
        db,
        db_object,
    )