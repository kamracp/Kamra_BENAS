from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.campuses.models.campus_model import Campus
from app.campuses.schemas.campus_schemas import CampusCreate, CampusUpdate

class CampusRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, campus_id: UUID) -> Optional[Campus]:
        return self.db.query(Campus).filter(Campus.id == campus_id).first()

    def get_by_code(self, code: str) -> Optional[Campus]:
        return self.db.query(Campus).filter(Campus.code == code).first()

    def get_multi_by_organization(self, organization_id: UUID, skip: int = 0, limit: int = 100) -> List[Campus]:
        return self.db.query(Campus).filter(Campus.organization_id == organization_id).offset(skip).limit(limit).all()

    def create(self, obj_in: CampusCreate) -> Campus:
        db_obj = Campus(
            organization_id=obj_in.organization_id,
            name=obj_in.name,
            code=obj_in.code,
            location=obj_in.location,
            description=obj_in.description,
            is_active=obj_in.is_active
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, db_obj: Campus, obj_in: CampusUpdate) -> Campus:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, campus_id: UUID) -> None:
        db_obj = self.get_by_id(campus_id)
        if db_obj:
            self.db.delete(db_obj)
            self.db.commit()