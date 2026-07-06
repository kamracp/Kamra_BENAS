from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.department import Department
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)


class DepartmentRepository:
    """Repository layer for Department."""

    def get_all(
        self,
        db: Session,
    ) -> list[Department]:
        return (
            db.execute(
                select(Department).order_by(
                    Department.department_name
                )
            )
            .scalars()
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        department_id: int,
    ) -> Department | None:
        return db.get(
            Department,
            department_id,
        )

    def get_by_code(
        self,
        db: Session,
        department_code: str,
    ) -> Department | None:
        return (
            db.execute(
                select(Department).where(
                    Department.department_code
                    == department_code
                )
            )
            .scalars()
            .first()
        )

    def create(
        self,
        db: Session,
        payload: DepartmentCreate,
    ) -> Department:
        department = Department(
            **payload.model_dump()
        )

        db.add(department)
        db.commit()
        db.refresh(department)

        return department

    def update(
        self,
        db: Session,
        department: Department,
        payload: DepartmentUpdate,
    ) -> Department:
        values = payload.model_dump(
            exclude_unset=True
        )

        for key, value in values.items():
            setattr(
                department,
                key,
                value,
            )

        db.commit()
        db.refresh(department)

        return department

    def delete(
        self,
        db: Session,
        department: Department,
    ) -> None:
        db.delete(department)
        db.commit()


department_repository = DepartmentRepository()