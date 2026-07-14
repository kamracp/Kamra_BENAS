from sqlalchemy.orm import Session

from app.models.department import Department
from app.schemas.department import DepartmentCreate, DepartmentUpdate


class DepartmentRepository:
    """All queries are scoped to a single organization (tenant)."""

    def __init__(self, db: Session, organization_id: int):
        self.db = db
        self.organization_id = organization_id

    def _base_query(self):
        return self.db.query(Department).filter(
            Department.organization_id == self.organization_id,
        )

    def get_all(self) -> list[Department]:
        return (
            self._base_query()
            .order_by(Department.department_name.asc())
            .all()
        )

    def get_by_id(self, department_id: int) -> Department | None:
        return (
            self._base_query()
            .filter(Department.id == department_id)
            .first()
        )

    def get_by_code(self, department_code: str) -> Department | None:
        return (
            self._base_query()
            .filter(Department.department_code == department_code)
            .first()
        )

    def create(self, department: DepartmentCreate) -> Department:
        db_department = Department(
            **department.model_dump(),
            organization_id=self.organization_id,
        )

        self.db.add(db_department)
        self.db.commit()
        self.db.refresh(db_department)

        return db_department

    def update(
        self,
        db_department: Department,
        department: DepartmentUpdate,
    ) -> Department:
        update_data = department.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_department, key, value)

        self.db.commit()
        self.db.refresh(db_department)

        return db_department

    def delete(self, db_department: Department) -> None:
        self.db.delete(db_department)
        self.db.commit()
