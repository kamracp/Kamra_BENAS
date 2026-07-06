from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationUpdate,
)


class OrganizationRepository:
    """Repository layer for Organization."""

    def get_all(
        self,
        db: Session,
    ) -> list[Organization]:
        return (
            db.execute(
                select(Organization).order_by(
                    Organization.organization_name
                )
            )
            .scalars()
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        organization_id: int,
    ) -> Organization | None:
        return db.get(
            Organization,
            organization_id,
        )

    def get_by_code(
        self,
        db: Session,
        organization_code: str,
    ) -> Organization | None:
        return (
            db.execute(
                select(Organization).where(
                    Organization.organization_code
                    == organization_code
                )
            )
            .scalars()
            .first()
        )

    def create(
        self,
        db: Session,
        payload: OrganizationCreate,
    ) -> Organization:
        organization = Organization(
            **payload.model_dump()
        )

        db.add(organization)
        db.commit()
        db.refresh(organization)

        return organization

    def update(
        self,
        db: Session,
        organization: Organization,
        payload: OrganizationUpdate,
    ) -> Organization:
        values = payload.model_dump(
            exclude_unset=True
        )

        for key, value in values.items():
            setattr(
                organization,
                key,
                value,
            )

        db.commit()
        db.refresh(organization)

        return organization

    def delete(
        self,
        db: Session,
        organization: Organization,
    ) -> None:
        db.delete(organization)
        db.commit()


organization_repository = OrganizationRepository()