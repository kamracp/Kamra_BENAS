from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = decode_access_token(token)

    if payload is None:
        raise UnauthorizedException("Invalid or expired token.")

    user = UserRepository(db).get_by_id(int(payload["sub"]))

    if user is None or not user.is_active:
        raise UnauthorizedException("User not found or disabled.")

    return user


def require_roles(*allowed_roles: str):
    """Dependency factory: restrict route to given roles."""

    def checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException(
                f"Role '{current_user.role}' is not allowed here.",
            )
        return current_user

    return checker


# Write access: everyone except read-only auditor
require_writer = require_roles("owner", "admin", "member")

# Admin-level access
require_admin = require_roles("owner", "admin")
