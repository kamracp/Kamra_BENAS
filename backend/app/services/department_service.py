from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.models.department import Department
from app.repositories.department_repository import DepartmentRepository
from app.schemas.department import DepartmentCreate, DepartmentUpdate


class DepartmentService:
    def __init__(self, repository: DepartmentRepository):
        self.repository = repository

    def get_all(self) -> list[Department]:
        return self.repository.get_all()

    def get_by_id(self, department_id: int) -> Department:
        department = self.repository.get_by_id(department_id)

        if department is None:
            raise ResourceNotFoundException("Department", department_id)

        return department

    def create(self, department: DepartmentCreate) -> Department:
        if self.repository.get_by_code(department.department_code):
            raise DuplicateResourceException(
                "Department",
                "department_code",
                department.department_code,
            )

        return self.repository.create(department)

    def update(
        self,
        department_id: int,
        department: DepartmentUpdate,
    ) -> Department:
        db_department = self.get_by_id(department_id)

        if (
            department.department_code
            and department.department_code != db_department.department_code
        ):
            if self.repository.get_by_code(department.department_code):
                raise DuplicateResourceException(
                    "Department",
                    "department_code",
                    department.department_code,
                )

        return self.repository.update(db_department, department)

    def delete(self, department_id: int) -> None:
        db_department = self.get_by_id(department_id)
        self.repository.delete(db_department)
