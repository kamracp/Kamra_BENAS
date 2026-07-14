from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import SignupRequest, Token, UserRead
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=Token, status_code=201)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db),
) -> Token:
    """Register a new Organization with its owner user."""
    return AuthService(db).signup(data)


@router.post("/login", response_model=Token)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    """Login with email (as username) and password."""
    return AuthService(db).login(form.username, form.password)


@router.get("/me", response_model=UserRead)
def me(
    current_user: User = Depends(get_current_user),
) -> User:
    """Return the currently authenticated user."""
    return current_user
