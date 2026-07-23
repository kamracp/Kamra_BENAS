from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.database.base import Base
from app.database.session import engine

from app.models.organization import Organization
from app.models.department import Department
from app.models.building import Building
from app.models.floor import Floor
from app.models.space import Space
from app.models.energy_meter import EnergyMeter
from app.models.utility_bill import UtilityBill
from app.models.emission_factor import EmissionFactor
from app.models.hvac_equipment import HvacEquipment
from app.models.occupant import Occupant



# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kamra BENAS API",
    description="Building Energy Performance & Net-Zero Accounting System",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "application": "Kamra BENAS API",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


# Enterprise API
app.include_router(api_router, prefix="/api/v1")