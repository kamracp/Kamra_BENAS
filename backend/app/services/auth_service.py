from sqlalchemy.orm import Session

from app.core.exceptions import (
    DuplicateResourceException,
    UnauthorizedException,
)
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.organization import Organization
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import SignupRequest, Token, UserRead


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.users = UserRepository(db)

    def signup(self, data: SignupRequest) -> Token:
        """Create Organization + owner user in a single transaction."""

        existing_org = (
            self.db.query(Organization)
            .filter(Organization.organization_code == data.organization_code)
            .first()
        )
        if existing_org:
            raise DuplicateResourceException(
                "Organization", "organization_code", data.organization_code,
            )

        if self.users.get_by_email(data.email):
            raise DuplicateResourceException(
                "User", "email", data.email,
            )

        organization = Organization(
            organization_code=data.organization_code,
            organization_name=data.organization_name,
        )
        self.db.add(organization)
        self.db.flush()

        user = User(
            organization_id=organization.id,
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
            role="owner",
        )
        self.users.create(user)
        self.db.commit()
        self.db.refresh(user)

        return self._build_token(user)

    def login(self, email: str, password: str) -> Token:
        user = self.users.get_by_email(email)

        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password.")

        if not user.is_active:
            raise UnauthorizedException("User account is disabled.")

        return self._build_token(user)

    def _build_token(self, user: User) -> Token:
        access_token = create_access_token(
            user_id=user.id,
            organization_id=user.organization_id,
            role=user.role,
            email=user.email,
        )
        return Token(
            access_token=access_token,
            user=UserRead.model_validate(user),
        )
