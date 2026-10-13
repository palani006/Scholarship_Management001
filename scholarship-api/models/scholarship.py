from sqlalchemy import Column, Integer, String, Float, Text
from database import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    deadline = Column(String(20), nullable=False)
    eligibility = Column(Text, nullable=False)
