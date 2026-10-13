from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from dependencies import get_db
from models.application import Application
from models.scholarship import Scholarship
from models.user import User
from schemas.application import ApplicationCreate, ApplicationStatusUpdate, ApplicationResponse
from utils.jwt import get_current_user, require_admin

router = APIRouter(prefix="/applications", tags=["Applications"])


def _build_application_response(app: Application, db: Session) -> dict:
    """Helper to build application response with joined data."""
    scholarship_name = app.scholarship.name if app.scholarship else None
    if not scholarship_name:
        scholarship = db.query(Scholarship).filter(Scholarship.id == app.scholarship_id).first()
        scholarship_name = scholarship.name if scholarship else None

    username = app.user.username if app.user else None
    if not username:
        user = db.query(User).filter(User.id == app.user_id).first()
        username = user.username if user else None

    return {
        "id": app.id,
        "scholarship_id": app.scholarship_id,
        "user_id": app.user_id,
        "statement": app.statement,
        "applied_at": app.applied_at,
        "status": app.status,
        "scholarship_name": scholarship_name,
        "username": username,
    }


@router.get("/", response_model=List[ApplicationResponse])
def list_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """View all applications. Admin only."""
    applications = db.query(Application).all()
    return [_build_application_response(app, db) for app in applications]


@router.get("/me", response_model=List[ApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """View own applications. Authenticated user."""
    applications = (
        db.query(Application)
        .filter(Application.user_id == current_user.id)
        .all()
    )
    return [_build_application_response(app, db) for app in applications]


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """View a single application. Admin can view any; user can only view their own."""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    if current_user.role != "admin" and application.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden",
        )
    return _build_application_response(application, db)



@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a new application for a scholarship. Authenticated user."""
    # Check if scholarship exists
    scholarship = (
        db.query(Scholarship)
        .filter(Scholarship.id == application.scholarship_id)
        .first()
    )
    if not scholarship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scholarship not found",
        )

    # Check for duplicate application
    existing = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id,
            Application.scholarship_id == application.scholarship_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this scholarship",
        )

    new_application = Application(
        scholarship_id=application.scholarship_id,
        user_id=current_user.id,
        statement=application.statement,
        applied_at=datetime.now(timezone.utc),
        status="Under Review",
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return _build_application_response(new_application, db)


@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Approve or Reject an application. Admin only."""
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if status_update.status not in ["Approved", "Rejected", "Under Review"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'Approved', 'Rejected', or 'Under Review'",
        )

    application.status = status_update.status
    db.commit()
    db.refresh(application)

    return _build_application_response(application, db)
