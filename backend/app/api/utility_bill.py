from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.energy_meter_repository import EnergyMeterRepository
from app.repositories.utility_bill_repository import UtilityBillRepository
from app.schemas.utility_bill import (
    UtilityBillCreate,
    UtilityBillResponse,
    UtilityBillUpdate,
)
from app.services.utility_bill_service import UtilityBillService

router = APIRouter(
    prefix="/utility-bills",
    tags=["Utility Bills"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UtilityBillService:
    org_id = current_user.organization_id

    return UtilityBillService(
        repository=UtilityBillRepository(db, organization_id=org_id),
        meter_repository=EnergyMeterRepository(db, organization_id=org_id),
    )


@router.get(
    "/",
    response_model=list[UtilityBillResponse],
)
def get_utility_bills(
    meter_id: int | None = Query(default=None, gt=0),
    service: UtilityBillService = Depends(get_service),
):
    return service.get_bills(meter_id=meter_id)


@router.get(
    "/{bill_id}",
    response_model=UtilityBillResponse,
)
def get_utility_bill(
    bill_id: int,
    service: UtilityBillService = Depends(get_service),
):
    return service.get_bill(bill_id)


@router.post(
    "/",
    response_model=UtilityBillResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_utility_bill(
    bill: UtilityBillCreate,
    service: UtilityBillService = Depends(get_service),
):
    return service.create_bill(bill)


@router.put(
    "/{bill_id}",
    response_model=UtilityBillResponse,
    dependencies=[Depends(require_writer)],
)
def update_utility_bill(
    bill_id: int,
    bill: UtilityBillUpdate,
    service: UtilityBillService = Depends(get_service),
):
    return service.update_bill(bill_id, bill)


@router.delete(
    "/{bill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_utility_bill(
    bill_id: int,
    service: UtilityBillService = Depends(get_service),
):
    service.delete_bill(bill_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)