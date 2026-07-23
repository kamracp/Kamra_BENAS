from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.production_record_repository import ProductionRecordRepository
from app.schemas.production_record import (
    ProductionRecordCreate,
    ProductionRecordResponse,
    ProductionRecordUpdate,
)
from app.services.production_record_service import ProductionRecordService

router = APIRouter(
    prefix="/production-records",
    tags=["Production Records"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProductionRecordService:
    repository = ProductionRecordRepository(db, organization_id=current_user.organization_id)
    return ProductionRecordService(repository)


@router.get("/", response_model=list[ProductionRecordResponse])
def get_all_records(
    manufacturing_unit_id: int | None = None,
    service: ProductionRecordService = Depends(get_service),
):
    if manufacturing_unit_id is not None:
        return service.get_by_unit(manufacturing_unit_id)
    return service.get_all()


@router.get("/{record_id}", response_model=ProductionRecordResponse)
def get_record(record_id: int, service: ProductionRecordService = Depends(get_service)):
    return service.get_by_id(record_id)


@router.post(
    "/",
    response_model=ProductionRecordResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_record(
    record: ProductionRecordCreate, service: ProductionRecordService = Depends(get_service)
):
    return service.create(record)


@router.put(
    "/{record_id}",
    response_model=ProductionRecordResponse,
    dependencies=[Depends(require_writer)],
)
def update_record(
    record_id: int,
    record: ProductionRecordUpdate,
    service: ProductionRecordService = Depends(get_service),
):
    return service.update(record_id, record)


@router.delete(
    "/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_record(record_id: int, service: ProductionRecordService = Depends(get_service)):
    service.delete(record_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
