from sqlalchemy import Column, String, Integer, Date, TIMESTAMP, text
from database import Base
import uuid

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255))
    category = Column(String(20))
    priority = Column(String(10))
    estimated_minutes = Column(Integer)
    due_date = Column(Date)
    status = Column(String(10), default="pending")
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
