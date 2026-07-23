from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.hvac_equipment_repository import HvacEquipmentRepository
from app.schemas.hvac_equipment import (
    HvacEquipmentCreate,
    HvacEquipmentResponse,
    HvacEquipmentUpdate,
)
from app.services.hvac_equipment_service import HvacEquipmentService

router = APIRouter(
    prefix="/hvac-equipment",
    tags=["HVAC Equipment"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> HvacEquipmentService:
    repository = HvacEquipmentRepository(
        db,
        organization_id=current_user.organization_id,
    )
    return HvacEquipmentService(repository)


@router.get(
    "/",
    response_model=list[HvacEquipmentResponse],
)
def get_all_equipment(
    building_id: int | None = None,
    service: HvacEquipmentService = Depends(get_service),
):
    if building_id is not None:
        return service.get_by_building(building_id)
    return service.get_all()


@router.get(
    "/{equipment_id}",
    response_model=HvacEquipmentResponse,
)
def get_equipment(
    equipment_id: int,
    service: HvacEquipmentService = Depends(get_service),
):
    return service.get_by_id(equipment_id)


@router.post(
    "/",
    response_model=HvacEquipmentResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_equipment(
    equipment: HvacEquipmentCreate,
    service: HvacEquipmentService = Depends(get_service),
):
    return service.create(equipment)


@router.put(
    "/{equipment_id}",
    response_model=HvacEquipmentResponse,
    dependencies=[Depends(require_writer)],
)
def update_equipment(
    equipment_id: int,
    equipment: HvacEquipmentUpdate,
    service: HvacEquipmentService = Depends(get_service),
):
    return service.update(equipment_id, equipment)


@router.delete(
    "/{equipment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_equipment(
    equipment_id: int,
    service: HvacEquipmentService = Depends(get_service),
):
    service.delete(equipment_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
