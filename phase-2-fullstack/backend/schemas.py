from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime
from models import TaskRead


class TaskCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    position: Optional[int] = 1

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if not v or len(v.strip()) < 1 or len(v) > 255:
            raise ValueError('Title must be between 1 and 255 characters')
        return v.strip()

    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        if v is not None and len(v) > 1000:
            raise ValueError('Description must be less than 1000 characters')
        return v

    @field_validator('position')
    @classmethod
    def validate_position(cls, v):
        if v is not None and v < 0:
            raise ValueError('Position must be a non-negative integer')
        return v


class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    position: Optional[int] = None

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if v is not None:
            if not v or len(v.strip()) < 1 or len(v) > 255:
                raise ValueError('Title must be between 1 and 255 characters')
            return v.strip()

    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        if v is not None and len(v) > 1000:
            raise ValueError('Description must be less than 1000 characters')
        return v

    @field_validator('position')
    @classmethod
    def validate_position(cls, v):
        if v is not None and v < 0:
            raise ValueError('Position must be a non-negative integer')
        return v


class TaskResponse(TaskRead):
    pass


class TaskListResponse(BaseModel):
    data: List[TaskResponse]
    pagination: dict


class ErrorResponse(BaseModel):
    detail: dict


class HealthResponse(BaseModel):
    status: str


class JWTPayload(BaseModel):
    user_id: str
    email: str
    exp: int
    iat: int


# --- Auth Schemas ---

class SignupRequest(BaseModel):
    email: str
    password: str
    confirmPassword: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not v or '@' not in v:
            raise ValueError('A valid email address is required')
        return v.strip().lower()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


class SigninRequest(BaseModel):
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not v or '@' not in v:
            raise ValueError('A valid email address is required')
        return v.strip().lower()


class UserResponse(BaseModel):
    id: str
    email: str
    createdAt: str


class AuthResponse(BaseModel):
    user: UserResponse
    jwtToken: str
    expiresIn: int