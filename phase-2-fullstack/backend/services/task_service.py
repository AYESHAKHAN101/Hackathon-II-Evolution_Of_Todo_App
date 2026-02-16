import sys
import os
from typing import List, Optional

# Add parent directory to path for imports when running directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select, func
from models import Task, TaskCreate, TaskUpdate, TaskRead
from fastapi import HTTPException, status


class TaskService:
    @staticmethod
    def get_tasks_by_user(
        session: Session,
        user_id: str,
        completed: Optional[bool] = None,
        limit: int = 100,
        offset: int = 0,
        order_by: str = "position",
        order_direction: str = "asc"
    ) -> List[Task]:
        """
        Get all tasks for a specific user with optional filtering and pagination
        """
        statement = select(Task).where(Task.user_id == user_id)

        # Apply completion filter if specified
        if completed is not None:
            statement = statement.where(Task.completed == completed)

        # Apply ordering
        if order_by == "position":
            if order_direction == "desc":
                statement = statement.order_by(Task.position.desc())
            else:
                statement = statement.order_by(Task.position.asc())
        elif order_by == "createdAt":
            if order_direction == "desc":
                statement = statement.order_by(Task.created_at.desc())
            else:
                statement = statement.order_by(Task.created_at.asc())
        elif order_by == "updatedAt":
            if order_direction == "desc":
                statement = statement.order_by(Task.updated_at.desc())
            else:
                statement = statement.order_by(Task.updated_at.asc())

        # Apply limit and offset
        statement = statement.offset(offset).limit(limit)

        return session.exec(statement).all()

    @staticmethod
    def reorder_tasks(session: Session, task_positions: List[dict], user_id: str) -> bool:
        """
        Update the position of multiple tasks at once for reordering
        task_positions: List of dicts with 'id' and 'position' keys
        """
        success = True

        for task_pos in task_positions:
            task_id = task_pos['id']
            new_position = task_pos['position']

            task = TaskService.get_task_by_id(session, task_id, user_id)
            if task:
                task.position = new_position
                session.add(task)
            else:
                success = False

        if success:
            session.commit()

        return success

    @staticmethod
    def get_task_by_id(session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """
        Get a specific task by ID for a specific user
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return session.exec(statement).first()

    @staticmethod
    def create_task(session: Session, task_data: TaskCreate, user_id: str) -> Task:
        """
        Create a new task for a specific user
        """
        # Set position to next available if not provided
        if task_data.position is None:
            # Get the highest position for this user and add 1
            max_position_result = session.exec(
                select(func.max(Task.position)).where(Task.user_id == user_id)
            ).first()
            task_data.position = (max_position_result or 0) + 1

        task = Task.model_validate(task_data, update={"user_id": user_id})
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def update_task(session: Session, task_id: int, task_update: TaskUpdate, user_id: str) -> Optional[Task]:
        """
        Update a task for a specific user
        """
        task = TaskService.get_task_by_id(session, task_id, user_id)
        if not task:
            return None

        # Update only provided fields
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        # Update the updated_at timestamp
        from datetime import datetime
        task.updated_at = datetime.now()

        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def delete_task(session: Session, task_id: int, user_id: str) -> bool:
        """
        Delete a task for a specific user
        """
        task = TaskService.get_task_by_id(session, task_id, user_id)
        if not task:
            return False

        session.delete(task)
        session.commit()
        return True

    @staticmethod
    def toggle_completion(session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """
        Toggle the completion status of a task
        """
        from datetime import datetime
        task = TaskService.get_task_by_id(session, task_id, user_id)
        if not task:
            return None

        task.completed = not task.completed
        task.updated_at = datetime.now()

        session.add(task)
        session.commit()
        session.refresh(task)
        return task