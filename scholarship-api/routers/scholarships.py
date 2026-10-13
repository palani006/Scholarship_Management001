from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from dependencies import get_db
from models.scholarship import Scholarship
from models.user import User
from schemas.scholarship import ScholarshipCreate, ScholarshipUpdate, ScholarshipResponse
from utils.jwt import get_current_user, require_admin

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])


@router.get("/", response_model=List[ScholarshipResponse])
def list_scholarships(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all scholarships. Accessible by both User and Admin."""
    scholarships = db.query(Scholarship).all()
    return scholarships


@router.get("/{scholarship_id}", response_model=ScholarshipResponse)
def get_scholarship(
    scholarship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific scholarship by ID. Accessible by both User and Admin."""
    scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not scholarship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scholarship not found",
        )
    return scholarship



@router.post("/", response_model=ScholarshipResponse, status_code=status.HTTP_201_CREATED)
def create_scholarship(
    scholarship: ScholarshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Create a new scholarship. Admin only."""
    new_scholarship = Scholarship(**scholarship.model_dump())
    db.add(new_scholarship)
    db.commit()
    db.refresh(new_scholarship)
    return new_scholarship


@router.put("/{scholarship_id}", response_model=ScholarshipResponse)
def update_scholarship(
    scholarship_id: int,
    scholarship: ScholarshipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Update an existing scholarship. Admin only."""
    db_scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not db_scholarship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scholarship not found",
        )

    update_data = scholarship.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_scholarship, key, value)

    db.commit()
    db.refresh(db_scholarship)
    return db_scholarship


@router.delete("/{scholarship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scholarship(
    scholarship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Delete a scholarship. Admin only."""
    db_scholarship = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not db_scholarship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scholarship not found",
        )

    db.delete(db_scholarship)
    db.commit()
    return None
