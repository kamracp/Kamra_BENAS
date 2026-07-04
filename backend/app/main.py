from fastapi import FastAPI

from app.database.base import Base
from app.database.session import engine

# Import models
from app.organizations.models.organization import Organization

# Import Routers
from app.organizations.api.organization_routes import router as organization_router

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kamra BENAS",
    version="0.1.0",
    description="Building Energy Performance & Net-Zero Accounting System",
)

app.include_router(organization_router)


@app.get("/")
def root():
    return {
        "application": "Kamra BENAS",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }