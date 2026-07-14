from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.department import (
    Department,
    DepartmentCreate,
    DepartmentUpdate,
)
from app.services.department_service import (
    department_service,
)

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
)


@router.get(
    "/",
    response_model=list[Department],
)
def get_departments(
    db: Session = Depends(get_db),
):
    return department_service.get_all(db)


@router.get(
    "/{department_id}",
    response_model=Department,
)
def get_department(
    department_id: int,
    db: Session = Depends(get_db),
):
    return department_service.get_by_id(
        db,
        department_id,
    )


@router.post(
    "/",
    response_model=Department,
    status_code=status.HTTP_201_CREATED,
)
def create_department(
    payload: DepartmentCreate,
    db: Session = Depends(get_db),
):
    return department_service.create(
        db,
        payload,
    )


@router.put(
    "/{department_id}",
    response_model=Department,
)
def update_department(
    department_id: int,
    payload: DepartmentUpdate,
    db: Session = Depends(get_db),
):
    return department_service.update(
        db,
        department_id,
        payload,
    )


@router.delete(
    "/{department_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
):
    department_service.delete(
        db,
        department_id,
    )

    return None