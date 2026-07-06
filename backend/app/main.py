from fastapi import FastAPI

from app.api.organization import router as organization_router
from app.database.base import Base
from app.database.session import engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kamra BENAS API",
    description="Building Energy Performance & Net-Zero Accounting System",
    version="0.1.0",
)

# Health Check
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


# API Routers
app.include_router(organization_router)