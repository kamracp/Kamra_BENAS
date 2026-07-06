from sqlalchemy.orm import Session

from app.organizations.models.organization import Organization
from app.organizations.schemas.organization_schema import (
    OrganizationCreate,
    OrganizationUpdate,
)


class OrganizationRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Organization)
            .order_by(Organization.organization_name.asc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        organization_id: int,
    ):
        return (
            db.query(Organization)
            .filter(Organization.id == organization_id)
            .first()
        )

    @staticmethod
    def get_by_code(
        db: Session,
        organization_code: str,
    ):
        return (
            db.query(Organization)
            .filter(
                Organization.organization_code == organization_code
            )
            .first()
        )

    @staticmethod
    def get_by_name(
        db: Session,
        organization_name: str,
    ):
        return (
            db.query(Organization)
            .filter(
                Organization.organization_name == organization_name
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        organization: OrganizationCreate,
    ):
        db_object = Organization(
            **organization.model_dump()
        )

        db.add(db_object)
        db.commit()
        db.refresh(db_object)

        return db_object

    @staticmethod
    def update(
        db: Session,
        db_object: Organization,
        organization: OrganizationUpdate,
    ):
        values = organization.model_dump(
            exclude_unset=True
        )

        for key, value in values.items():
            setattr(db_object, key, value)

        db.commit()
        db.refresh(db_object)

        return db_object

    @staticmethod
    def delete(
        db: Session,
        db_object: Organization,
    ):
        db.delete(db_object)
        db.commit()