from sqlalchemy.orm import Session

from app.organizations.repositories.organization_repository import (
    OrganizationRepository,
)
from app.organizations.schemas.organization_schema import (
    OrganizationCreate,
    OrganizationUpdate,
)


class OrganizationService:

    @staticmethod
    def get_all(db: Session):
        return OrganizationRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db: Session,
        organization_id: int,
    ):
        return OrganizationRepository.get_by_id(
            db,
            organization_id,
        )

    @staticmethod
    def create(
        db: Session,
        organization: OrganizationCreate,
    ):
        return OrganizationRepository.create(
            db,
            organization,
        )

    @staticmethod
    def update(
        db: Session,
        db_object,
        organization: OrganizationUpdate,
    ):
        return OrganizationRepository.update(
            db,
            db_object,
            organization,
        )

    @staticmethod
    def delete(
        db: Session,
        db_object,
    ):
        OrganizationRepository.delete(
            db,
            db_object,
        )