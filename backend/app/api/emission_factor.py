from datetime import date

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_writer
from app.database.session import get_db
from app.models.user import User
from app.repositories.emission_factor_repository import (
    EmissionFactorRepository,
)
from app.schemas.emission_factor import (
    EmissionFactorCreate,
    EmissionFactorResponse,
    EmissionFactorUpdate,
)
from app.services.emission_factor_service import EmissionFactorService

router = APIRouter(
    prefix="/emission-factors",
    tags=["Emission Factors"],
)


def get_service(
    db: Session = Depends(get_db),
    # Login required, but NOTE: no organization_id is passed —
    # emission factors are global reference data shared by all tenants.
    current_user: User = Depends(get_current_user),
) -> EmissionFactorService:
    return EmissionFactorService(
        repository=EmissionFactorRepository(db),
    )


@router.get(
    "/",
    response_model=list[EmissionFactorResponse],
)
def get_emission_factors(
    meter_type: str | None = Query(default=None),
    region: str | None = Query(default=None),
    include_inactive: bool = Query(default=False),
    service: EmissionFactorService = Depends(get_service),
):
    return service.get_factors(
        meter_type=meter_type,
        region=region,
        include_inactive=include_inactive,
    )


# NOTE: declared BEFORE /{factor_id} so the path word "applicable"
# is never mistaken for an id.
@router.get(
    "/applicable",
    response_model=EmissionFactorResponse,
)
def get_applicable_emission_factor(
    meter_type: str = Query(...),
    unit: str = Query(...),
    on_date: date = Query(...),
    region: str = Query(default="IN"),
    service: EmissionFactorService = Depends(get_service),
):
    """The carbon engine's lookup, exposed for testing and transparency:
    which official factor applies to this meter type / unit / region
    on this date?"""
    return service.get_applicable_factor(
        meter_type=meter_type,
        unit=unit,
        on_date=on_date,
        region=region,
    )


@router.get(
    "/{factor_id}",
    response_model=EmissionFactorResponse,
)
def get_emission_factor(
    factor_id: int,
    service: EmissionFactorService = Depends(get_service),
):
    return service.get_factor(factor_id)


@router.post(
    "/",
    response_model=EmissionFactorResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_writer)],
)
def create_emission_factor(
    factor: EmissionFactorCreate,
    service: EmissionFactorService = Depends(get_service),
):
    return service.create_factor(factor)


@router.put(
    "/{factor_id}",
    response_model=EmissionFactorResponse,
    dependencies=[Depends(require_writer)],
)
def update_emission_factor(
    factor_id: int,
    factor: EmissionFactorUpdate,
    service: EmissionFactorService = Depends(get_service),
):
    return service.update_factor(factor_id, factor)


@router.delete(
    "/{factor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_writer)],
)
def delete_emission_factor(
    factor_id: int,
    service: EmissionFactorService = Depends(get_service),
):
    service.delete_factor(factor_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
