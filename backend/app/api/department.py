from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.department_repository import DepartmentRepository
from app.schemas.department import (
    Department,
    DepartmentCreate,
    DepartmentUpdate,
)
from app.services.department_service import DepartmentService

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
)


def get_service(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DepartmentService:
    repository = DepartmentRepository(
        db,
        organization_id=current_user.organization_id,
    )
    return DepartmentService(repository)


@router.get("/", response_model=list[Department])
def get_departments(
    service: DepartmentService = Depends(get_service),
):
    return service.get_all()


@router.get("/{department_id}", response_model=Department)
def get_department(
    department_id: int,
    service: DepartmentService = Depends(get_service),
):
    return service.get_by_id(department_id)


@router.post(
    "/",
    response_model=Department,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_department(
    payload: DepartmentCreate,
    service: DepartmentService = Depends(get_service),
):
    return service.create(payload)


@router.put(
    "/{department_id}",
    response_model=Department,
    dependencies=[Depends(require_writer)],
)
def update_department(
    department_id: int,
    payload: DepartmentUpdate,
    service: DepartmentService = Depends(get_service),
):
    return service.update(department_id, payload)


@router.delete(
    "/{department_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_department(
    department_id: int,
    service: DepartmentService = Depends(get_service),
):
    service.delete(department_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
