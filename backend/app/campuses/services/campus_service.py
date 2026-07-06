from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status
from app.campuses.repositories.campus_repository import CampusRepository
from app.campuses.schemas.campus_schemas import CampusCreate, CampusUpdate
from app.campuses.models.campus_model import Campus

class CampusService:
    def __init__(self, repository: CampusRepository):
        self.repository = repository

    def create(self, obj_in: CampusCreate) -> Campus:
        # Check if the campus code is unique globally or across architecture boundaries
        if self.repository.get_by_code(obj_in.code):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Campus with system code '{obj_in.code}' already exists."
            )
        return self.repository.create(obj_in)

    def get_by_id(self, campus_id: UUID) -> Optional[Campus]:
        return self.repository.get_by_id(campus_id)

    def get_by_organization(self, organization_id: UUID, skip: int = 0, limit: int = 100) -> List[Campus]:
        return self.repository.get_multi_by_organization(organization_id, skip=skip, limit=limit)

    def update(self, campus_id: UUID, obj_in: CampusUpdate) -> Campus:
        db_obj = self.repository.get_by_id(campus_id)
        if not db_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campus node not found.")
        return self.repository.update(db_obj, obj_in)

    def delete(self, campus_id: UUID) -> None:
        db_obj = self.repository.get_by_id(campus_id)
        if not db_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campus node not found.")
        self.repository.delete(campus_id)
        