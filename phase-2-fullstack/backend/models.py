from sqlmodel import SQLModel, Field, create_engine
from datetime import datetime
from typing import Optional
import uuid


class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    last_login_at: Optional[datetime] = Field(default=None)


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    position: Optional[int] = Field(default=0, index=True)  # For ordering tasks, indexed for performance
    user_id: str = Field(index=True)  # Indexed for performance


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False, index=True)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False, index=True)


class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime


class TaskCreate(TaskBase):
    title: str = Field(min_length=1, max_length=255)
    position: Optional[int] = Field(default=None)  # Allow None to auto-assign position


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
    position: Optional[int] = None