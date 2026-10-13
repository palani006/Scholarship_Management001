from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ApplicationCreate(BaseModel):
    scholarship_id: int
    statement: str


class ApplicationStatusUpdate(BaseModel):
    status: str  # 'Approved' or 'Rejected'


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    scholarship_id: int
    user_id: int
    statement: str
    applied_at: datetime
    status: str
    scholarship_name: Optional[str] = None
    username: Optional[str] = None

