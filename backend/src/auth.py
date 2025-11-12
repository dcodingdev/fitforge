import warnings
warnings.filterwarnings("ignore", message="error reading bcrypt version")

from fastapi import Depends, Request, HTTPException, status
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from fastapi_users.schemas import BaseUserCreate
from passlib.context import CryptContext
from typing import Optional

from src.db import User, get_user_db

import os 

from dotenv import load_dotenv

load_dotenv()  # loads .env variables

DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserManager(BaseUserManager[User, str]):
    reset_password_token_secret = SECRET_KEY
    verification_token_secret = SECRET_KEY

    def parse_id(self, user_id: str) -> str:
        return user_id

    async def on_after_register(self, user: User, request: Request | None = None):
        print(f"User {user.id} registered.")

    async def create(
        self,
        user_create: BaseUserCreate,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> User:
        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_password = pwd_context.hash(user_create.password)
        user = User(
            email=user_create.email,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=False,
            is_verified=False,
        )
        return await self.user_db.create(user)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET_KEY, lifetime_seconds=3600 * 24 * 7)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, str](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)
