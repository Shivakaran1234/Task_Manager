from pydantic import BaseModel
from datetime import date
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    category: Optional[str]
    priority: Optional[str]
    estimated_minutes: Optional[int]
    due_date: Optional[date]

class TaskResponse(TaskCreate):
    id: str
    status: str
