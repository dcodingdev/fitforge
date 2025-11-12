
from sqlmodel import SQLModel, Field, Relationship, select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from typing import AsyncGenerator, Optional
import uuid
from datetime import datetime
import os

from dotenv import load_dotenv

load_dotenv()  # loads .env variables

DATABASE_URL = os.getenv("DATABASE_URL")

# ----- DATABASE URL -----
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://fitforge:fitforge123@db:5432/fitforge"
)

# ----- Async engine -----
engine = create_async_engine(DATABASE_URL, echo=False, future=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

async def create_db_and_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

# ----- MODELS -----
class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    is_verified: bool = Field(default=False)
    ratings: list["WorkoutRating"] = Relationship(back_populates="user")

class WorkoutRating(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    workout_id: int
    rating: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user: User = Relationship(back_populates="ratings")

# ----- USER CRUD -----
class UserDB:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, id: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.id == id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, user: User) -> User:
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def update(self, user: User, update_dict: dict) -> User:
        for key, value in update_dict.items():
            setattr(user, key, value)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield UserDB(session)
