import logging
import time
import sys
import os
from datetime import datetime, timedelta
from typing import Optional

# Add parent directory to path for imports when running directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jose import jwt
from passlib.context import CryptContext
from sqlmodel import Session, select

from models import User
from settings import settings

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_jwt_token(user_id: str, email: str) -> tuple[str, int]:
        """Create a JWT token and return (token, expires_in_seconds)."""
        expires_in = settings.access_token_expire_minutes * 60
        now = int(time.time())
        payload = {
            "user_id": user_id,
            "email": email,
            "iat": now,
            "exp": now + expires_in,
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")
        return token, expires_in

    @staticmethod
    def get_user_by_email(session: Session, email: str) -> Optional[User]:
        statement = select(User).where(User.email == email)
        return session.exec(statement).first()

    @staticmethod
    def create_user(session: Session, email: str, password: str) -> User:
        hashed = AuthService.hash_password(password)
        user = User(email=email, hashed_password=hashed)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    @staticmethod
    def update_last_login(session: Session, user: User) -> None:
        user.last_login_at = datetime.now()
        session.add(user)
        session.commit()
