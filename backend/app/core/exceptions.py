from fastapi import HTTPException, status


class BENASException(HTTPException):
    """Base exception for BENAS."""

    def __init__(
        self,
        status_code: int,
        detail: str,
    ) -> None:
        super().__init__(
            status_code=status_code,
            detail=detail,
        )


class ResourceNotFoundException(BENASException):
    """Raised when a resource does not exist."""

    def __init__(
        self,
        resource: str,
        identifier: str | int,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"{resource} "
                f"'{identifier}' "
                f"was not found."
            ),
        )


class DuplicateResourceException(BENASException):
    """Raised when a duplicate resource is detected."""

    def __init__(
        self,
        resource: str,
        field: str,
        value: str,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"{resource} already exists "
                f"with {field}='{value}'."
            ),
        )


class ValidationException(BENASException):
    """Raised for business validation errors."""

    def __init__(
        self,
        detail: str,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )


class UnauthorizedException(BENASException):
    """Raised for unauthorized access."""

    def __init__(
        self,
        detail: str = "Unauthorized access.",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
        )


class ForbiddenException(BENASException):
    """Raised when access is forbidden."""

    def __init__(
        self,
        detail: str = "Access denied.",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


class ConflictException(BENASException):
    """Raised when a business conflict occurs."""

    def __init__(
        self,
        detail: str,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
        )


class DatabaseException(BENASException):
    """Raised for unexpected database errors."""

    def __init__(
        self,
        detail: str = "Database operation failed.",
    ) -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        )