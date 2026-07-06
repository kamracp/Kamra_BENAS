from sqlalchemy.orm import Session

from app.core.exceptions import (
    DuplicateResourceException,
    ResourceNotFoundException,
)
from app.models.organization import Organization
from app.repositories.organization_repository import (
    organization_repository,
)
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationUpdate,
)


class OrganizationService:
    """Business service for Organization."""

    def get_all(
        self,
        db: Session,
    ) -> list[Organization]:
        return organization_repository.get_all(db)

    def get_by_id(
        self,
        db: Session,
        organization_id: int,
    ) -> Organization:

        organization = organization_repository.get_by_id(
            db,
            organization_id,
        )

        if organization is None:
            raise ResourceNotFoundException(
                "Organization",
                organization_id,
            )

        return organization

    def create(
        self,
        db: Session,
        payload: OrganizationCreate,
    ) -> Organization:

        existing = organization_repository.get_by_code(
            db,
            payload.organization_code,
        )

        if existing:
            raise DuplicateResourceException(
                "Organization",
                "organization_code",
                payload.organization_code,
            )

        return organization_repository.create(
            db,
            payload,
        )

    def update(
        self,
        db: Session,
        organization_id: int,
        payload: OrganizationUpdate,
    ) -> Organization:

        organization = self.get_by_id(
            db,
            organization_id,
        )

        if (
            payload.organization_code
            and payload.organization_code
            != organization.organization_code
        ):

            duplicate = organization_repository.get_by_code(
                db,
                payload.organization_code,
            )

            if duplicate:
                raise DuplicateResourceException(
                    "Organization",
                    "organization_code",
                    payload.organization_code,
                )

        return organization_repository.update(
            db,
            organization,
            payload,
        )

    def delete(
        self,
        db: Session,
        organization_id: int,
    ) -> None:

        organization = self.get_by_id(
            db,
            organization_id,
        )

        organization_repository.delete(
            db,
            organization,
        )


organization_service = OrganizationService()