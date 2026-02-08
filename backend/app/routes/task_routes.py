from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sys import path
from pathlib import Path
from typing import Optional

# Add parent directory to path
path.insert(0, str(Path(__file__).parent.parent.parent))

from database import SessionLocal
from app.models.task_model import Task
from app.schemas.task_schema import TaskCreate

router = APIRouter()

class TaskUpdate(BaseModel):
    completed: Optional[bool] = None
    archived: Optional[bool] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.put("/{task_id}")
def update_task(task_id: str, update: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    
    if update.completed is not None:
        task.status = "completed" if update.completed else "pending"
    
    if update.archived is not None:
        task.status = "archived" if update.archived else "completed"
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
