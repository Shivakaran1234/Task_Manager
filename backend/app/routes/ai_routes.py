from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sys import path
from pathlib import Path
from fastapi.responses import JSONResponse
import json
import logging
import traceback

# Add parent directory to path
path.insert(0, str(Path(__file__).parent.parent.parent))

from app.services.ai_parser import parse_brain_dump

router = APIRouter()


class BrainDump(BaseModel):
    text: str


@router.post("/parse-task")
def parse_task(data: BrainDump):
    try:
        result = parse_brain_dump(data.text)
    except Exception as e:
        # Log full traceback for debugging
        logging.error("Error in parse_brain_dump: %s", e)
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": "AI parsing failed", "details": str(e)})

    try:
        return json.loads(result)
    except Exception as e:
        logging.error("Invalid JSON from AI service: %s", e)
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": "Invalid JSON from AI service", "details": str(e)})
