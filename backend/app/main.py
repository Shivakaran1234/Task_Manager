from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sys import path
from pathlib import Path

# Add parent directory to path so we can import database module
path.insert(0, str(Path(__file__).parent.parent))

from database import Base, engine
from app.routes.ai_routes import router as ai_router
from app.routes.task_routes import router as task_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS so the frontend (localhost:5173) can call the API
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(ai_router, prefix="/api/ai")
app.include_router(task_router, prefix="/api/tasks")
