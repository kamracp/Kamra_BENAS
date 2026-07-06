from sqlalchemy.orm import Session

from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.models.department import Department
from app.repositories.department_repository import (
    department_repository,
)
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)


class DepartmentService:
    """Business service for Department."""

    def get_all(
        self,
        db: Session,
    ) -> list[Department]:
        return department_repository.get_all(db)

    def get_by_id(
        self,
        db: Session,
        department_id: int,
    ) -> Department:

        department = department_repository.get_by_id(
            db,
            department_id,
        )

        if department is None:
            raise ResourceNotFoundException(
                "Department",
                department_id,
            )

        return department

    def create(
        self,
        db: Session,
        payload: DepartmentCreate,
    ) -> Department:

        existing = department_repository.get_by_code(
            db,
            payload.department_code,
        )

        if existing:
            raise DuplicateResourceException(
                "Department",
                "department_code",
                payload.department_code,
            )

        return department_repository.create(
            db,
            payload,
        )

    def update(
        self,
        db: Session,
        department_id: int,
        payload: DepartmentUpdate,
    ) -> Department:

        department = self.get_by_id(
            db,
            department_id,
        )

        if (
            payload.department_code
            and payload.department_code
            != department.department_code
        ):

            duplicate = department_repository.get_by_code(
                db,
                payload.department_code,
            )

            if duplicate:
                raise DuplicateResourceException(
                    "Department",
                    "department_code",
                    payload.department_code,
                )

        return department_repository.update(
            db,
            department,
            payload,
        )

    def delete(
        self,
        db: Session,
        department_id: int,
    ) -> None:

        department = self.get_by_id(
            db,
            department_id,
        )

        department_repository.delete(
            db,
            department,
        )


department_service = DepartmentService()