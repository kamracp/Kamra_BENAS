from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.services.tenant_billing_service import calculate_tenant_billing_for_floor

router = APIRouter(
    prefix="/tenant-billing",
    tags=["Tenant Billing"],
)


@router.get("/floor/{floor_id}")
def get_floor_billing(
    floor_id: int,
    billing_month: date | None = Query(
        default=None,
        description="Any date within the target billing month (e.g. 2026-08-01). Defaults to the current month.",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return calculate_tenant_billing_for_floor(
        db, current_user.organization_id, floor_id, billing_month
    )