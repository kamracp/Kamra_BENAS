
from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.organization import router as organization_router
from app.api.department import router as department_router
from app.api.building import router as building_router
from app.api.floor import router as floor_router
from app.api.space import router as space_router
from app.api.energy_meter import router as energy_meter_router
from app.api.utility_bill import router as utility_bill_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(organization_router)
api_router.include_router(department_router)
api_router.include_router(building_router)
api_router.include_router(floor_router)
api_router.include_router(space_router)
api_router.include_router(energy_meter_router)
api_router.include_router(utility_bill_router)