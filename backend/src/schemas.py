

from pydantic import BaseModel, Field, ConfigDict
from typing import List
from datetime import datetime
from fastapi_users import schemas

# ---- Override fastapi-users base schemas (V2) ----
class UserRead(schemas.BaseUser[str]):
    model_config = ConfigDict(from_attributes=True)

class UserCreate(schemas.BaseUserCreate):
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(schemas.BaseUserUpdate):
    model_config = ConfigDict(from_attributes=True)
# -------------------------------------------------

# ---------- Main Input Schema ----------
class UserInput(BaseModel):
    goal: str = Field(..., example="Lose fat")
    preferred_type: str = Field(..., example="Strength training")
    equipment_access: str = Field(..., example="Dumbbell")
    preferred_bodypart: str = Field(..., example="Chest")
    fitness_level: str = Field(..., example="Intermediate")
    model_config = ConfigDict(from_attributes=True)

# ---------- Rating ----------
class RateWorkout(BaseModel):
    workout_id: int
    rating: float = Field(..., ge=1, le=10)
    model_config = ConfigDict(from_attributes=True)

class RatingResponse(BaseModel):
    message: str
    model_config = ConfigDict(from_attributes=True)

# ---------- Recommendations ----------
class WorkoutRec(BaseModel):
    workout_id: int
    title: str
    type: str
    bodypart: str
    equipment: str
    level: str
    score: float
    model_config = ConfigDict(from_attributes=True)

class RecommendationResponse(BaseModel):
    mode: str
    recommendations: List[WorkoutRec]
    model_config = ConfigDict(from_attributes=True)

# ---------- History ----------
class HistoryItem(BaseModel):
    workout_id: int
    title: str
    rating: float
    rated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ---------- Top Workouts ----------
class TopWorkout(BaseModel):
    workout_id: int
    title: str
    avg_rating: float
    count: int
    model_config = ConfigDict(from_attributes=True)
