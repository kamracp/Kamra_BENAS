from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.building_repository import BuildingRepository
from app.repositories.energy_meter_repository import EnergyMeterRepository
from app.schemas.energy_meter import (
    EnergyMeterCreate,
    EnergyMeterResponse,
    EnergyMeterUpdate,
)
from app.services.energy_meter_service import EnergyMeterService

router = APIRouter(
    prefix="/energy-meters",
    tags=["Energy Meters"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EnergyMeterService:
    org_id = current_user.organization_id

    return EnergyMeterService(
        repository=EnergyMeterRepository(db, organization_id=org_id),
        building_repository=BuildingRepository(db, organization_id=org_id),
    )


@router.get(
    "/",
    response_model=list[EnergyMeterResponse],
)
def get_energy_meters(
    building_id: int | None = Query(default=None, gt=0),
    service: EnergyMeterService = Depends(get_service),
):
    return service.get_meters(building_id=building_id)


@router.get(
    "/{meter_id}",
    response_model=EnergyMeterResponse,
)
def get_energy_meter(
    meter_id: int,
    service: EnergyMeterService = Depends(get_service),
):
    return service.get_meter(meter_id)


@router.post(
    "/",
    response_model=EnergyMeterResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_energy_meter(
    meter: EnergyMeterCreate,
    service: EnergyMeterService = Depends(get_service),
):
    return service.create_meter(meter)


@router.put(
    "/{meter_id}",
    response_model=EnergyMeterResponse,
    dependencies=[Depends(require_writer)],
)
def update_energy_meter(
    meter_id: int,
    meter: EnergyMeterUpdate,
    service: EnergyMeterService = Depends(get_service),
):
    return service.update_meter(meter_id, meter)


@router.delete(
    "/{meter_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_energy_meter(
    meter_id: int,
    service: EnergyMeterService = Depends(get_service),
):
    service.delete_meter(meter_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)