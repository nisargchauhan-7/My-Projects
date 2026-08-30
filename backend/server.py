from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ---------- SynapseEDU AI (Gemini via Emergent Universal key) ----------
import asyncio
import ai_service

AI_TIMEOUT = 35

class TutorRequest(BaseModel):
    topicId: str | None = None
    topicName: str
    question: str
    model: str | None = None

class QuizRequest(BaseModel):
    topicName: str
    difficulty: str = "medium"
    count: int = 5
    model: str | None = None

class ExtractRequest(BaseModel):
    text: str = ""
    model: str | None = None

@api_router.get("/ai/status")
async def ai_status():
    return {"enabled": ai_service.enabled(), "model": ai_service.DEFAULT_MODEL,
            "models": sorted(ai_service.ALLOWED_MODELS)}

@api_router.post("/ai/tutor")
async def ai_tutor(req: TutorRequest):
    if not ai_service.enabled():
        return {"error": "ai_disabled"}
    try:
        return await asyncio.wait_for(ai_service.tutor(req.topicName, req.question, req.model or ai_service.DEFAULT_MODEL), timeout=AI_TIMEOUT)
    except Exception as e:
        logger.exception("tutor failed")
        return {"error": str(e)}

@api_router.post("/ai/quiz")
async def ai_quiz(req: QuizRequest):
    if not ai_service.enabled():
        return {"error": "ai_disabled", "questions": []}
    try:
        qs = await asyncio.wait_for(ai_service.quiz(req.topicName, req.difficulty, req.count, req.model or ai_service.DEFAULT_MODEL), timeout=AI_TIMEOUT)
        return {"questions": qs, "model": req.model or ai_service.DEFAULT_MODEL}
    except Exception as e:
        logger.exception("quiz gen failed")
        return {"error": str(e), "questions": []}

@api_router.post("/ai/extract")
async def ai_extract(req: ExtractRequest):
    if not ai_service.enabled():
        return {"error": "ai_disabled", "topics": []}
    try:
        topics = await asyncio.wait_for(ai_service.extract(req.text, req.model or ai_service.DEFAULT_MODEL), timeout=AI_TIMEOUT)
        return {"topics": topics, "model": req.model or ai_service.DEFAULT_MODEL}
    except Exception as e:
        logger.exception("extract failed")
        return {"error": str(e), "topics": []}


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()