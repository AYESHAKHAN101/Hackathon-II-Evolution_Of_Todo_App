import logging
import sys
import os

# Add parent directory to path for imports when running directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlmodel import Session, select, func
from typing import List, Optional
from db import get_session
from models import Task, TaskCreate, TaskUpdate
from schemas import (
    TaskCreateRequest, TaskUpdateRequest, TaskResponse, TaskListResponse, ErrorResponse
)
from auth import get_current_user
from services.task_service import TaskService
from schemas import JWTPayload

logger = logging.getLogger(__name__)


router = APIRouter()


@router.get("/", response_model=TaskListResponse, responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}})
async def get_tasks(
    user_id: str,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    limit: int = Query(100, ge=1, le=1000, description="Limit number of results"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    order_by: str = Query("position", description="Field to order by"),
    order_direction: str = Query("asc", description="Direction of ordering")
):
    """
    Retrieve all tasks for the authenticated user with optional filtering.
    """
    logger.info(f"Getting tasks for user {user_id} with filters: completed={completed}")

    tasks = TaskService.get_tasks_by_user(
        session=session,
        user_id=user_id,
        completed=completed,
        limit=limit,
        offset=offset,
        order_by=order_by,
        order_direction=order_direction
    )

    # Convert to response format
    task_responses = []
    for task in tasks:
        task_dict = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'completed': task.completed,
            'position': task.position,
            'user_id': task.user_id,
            'created_at': task.created_at,
            'updated_at': task.updated_at
        }
        task_responses.append(TaskResponse(**task_dict))

    total_statement = select(func.count(Task.id)).where(Task.user_id == user_id)
    if completed is not None:
        total_statement = total_statement.where(Task.completed == completed)

    total = session.exec(total_statement).one()

    return TaskListResponse(
        data=task_responses,
        pagination={
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total
        }
    )


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 422: {"model": ErrorResponse}})
async def create_task(
    user_id: str,
    task_request: TaskCreateRequest,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    """
    task_create = TaskCreate(**task_request.model_dump(), user_id=user_id)
    task = TaskService.create_task(session, task_create, user_id)

    task_dict = {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'position': task.position,
        'user_id': task.user_id,
        'created_at': task.created_at,
        'updated_at': task.updated_at
    }

    return TaskResponse(**task_dict)


@router.get("/{task_id}", response_model=TaskResponse, responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}})
async def get_task(
    user_id: str,
    task_id: int,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve a specific task for the authenticated user.
    """
    task = TaskService.get_task_by_id(session, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_dict = {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'position': task.position,
        'user_id': task.user_id,
        'created_at': task.created_at,
        'updated_at': task.updated_at
    }

    return TaskResponse(**task_dict)


@router.put("/{task_id}", response_model=TaskResponse, responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}})
async def update_task(
    user_id: str,
    task_id: int,
    task_request: TaskUpdateRequest,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update an existing task for the authenticated user.
    """
    task_update = TaskUpdate(**task_request.model_dump(exclude_unset=True))
    task = TaskService.update_task(session, task_id, task_update, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_dict = {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'position': task.position,
        'user_id': task.user_id,
        'created_at': task.created_at,
        'updated_at': task.updated_at
    }

    return TaskResponse(**task_dict)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}})
async def delete_task(
    user_id: str,
    task_id: int,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task for the authenticated user.
    """
    success = TaskService.delete_task(session, task_id, user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Return 204 No Content


@router.patch("/{task_id}/complete", response_model=TaskResponse, responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}, 404: {"model": ErrorResponse}})
async def toggle_task_completion(
    user_id: str,
    task_id: int,
    current_user: JWTPayload = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a task.
    """
    task = TaskService.toggle_completion(session, task_id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_dict = {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'completed': task.completed,
        'position': task.position,
        'user_id': task.user_id,
        'created_at': task.created_at,
        'updated_at': task.updated_at
    }

    return TaskResponse(**task_dict)