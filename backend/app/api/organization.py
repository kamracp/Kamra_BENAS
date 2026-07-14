from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin
from app.database.session import get_db
from app.models.user import User
from app.schemas.organization import (
    OrganizationResponse,
    OrganizationUpdate,
)
from app.services.organization_service import organization_service

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)

# NOTE: Organization creation happens only via /auth/signup.
# Listing all organizations is not allowed in multi-tenant mode.


@router.get(
    "/me",
    response_model=OrganizationResponse,
)
def get_my_organization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the authenticated user's own organization."""
    return organization_service.get_by_id(
        db,
        current_user.organization_id,
    )


@router.put(
    "/me",
    response_model=OrganizationResponse,
)
def update_my_organization(
    payload: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Update own organization. Owner/admin only."""
    return organization_service.update(
        db,
        current_user.organization_id,
        payload,
    )
