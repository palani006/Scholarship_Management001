from pydantic import BaseModel, ConfigDict
from typing import Optional


class ScholarshipCreate(BaseModel):
    name: str
    description: str
    amount: float
    deadline: str
    eligibility: str


class ScholarshipUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    deadline: Optional[str] = None
    eligibility: Optional[str] = None


class ScholarshipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    amount: float
    deadline: str
    eligibility: str

