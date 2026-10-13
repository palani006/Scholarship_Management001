from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    statement = Column(Text, nullable=False)
    applied_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    status = Column(String(20), default="Under Review", nullable=False)

    # Relationships
    scholarship = relationship("Scholarship", backref="applications")
    user = relationship("User", backref="applications")
