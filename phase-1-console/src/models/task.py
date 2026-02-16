"""
Task data model for the todo application.
This module defines the Task class and in-memory storage for the application.

Based on task T005: Create Task data model in src/models/task.py
Based on task T006: Create in-memory task storage in src/models/task.py
Based on task T007: Create task validation functions in src/models/task.py
Based on task T008: Create task utility functions (get_next_id, find_by_id) in src/models/task.py
"""

from typing import Dict, List, Optional, Union
import re


class Task:
    """Represents a single todo task with id, title, description, and completion status."""

    def __init__(self, task_id: int, title: str, description: str = "", completed: bool = False):
        """
        Initialize a Task instance.

        Args:
            task_id: Unique identifier for the task
            title: Task title (required, 1-200 characters)
            description: Optional task description (max 1000 characters)
            completed: Boolean indicating if task is completed (default: False)
        """
        self.id = task_id
        self.title = self._validate_title(title)
        self.description = self._validate_description(description)
        self.completed = completed

    def _validate_title(self, title: str) -> str:
        """Validate the task title according to requirements."""
        if not isinstance(title, str):
            raise ValueError("Title must be a string")

        if not title.strip():
            raise ValueError("Title cannot be empty or contain only whitespace")

        if len(title.strip()) < 1 or len(title.strip()) > 200:
            raise ValueError(f"Title must be between 1 and 200 characters, got {len(title.strip())}")

        return title.strip()

    def _validate_description(self, description: str) -> str:
        """Validate the task description according to requirements."""
        if not isinstance(description, str):
            raise ValueError("Description must be a string")

        if len(description) > 1000:
            raise ValueError(f"Description must be 1000 characters or less, got {len(description)}")

        return description.strip()


# Global in-memory storage for tasks
tasks: List[Task] = []
next_task_id: int = 1


def get_next_id() -> int:
    """
    Get the next available task ID.

    Returns:
        The next available integer ID for a new task
    """
    global next_task_id
    return next_task_id


def increment_next_id():
    """Increment the global next_task_id counter."""
    global next_task_id
    next_task_id += 1


def add_task_to_storage(task: Task):
    """
    Add a task to the in-memory storage.

    Args:
        task: The Task object to add to storage
    """
    tasks.append(task)


def find_task_by_id(task_id: int) -> Optional[Task]:
    """
    Find a task by its ID.

    Args:
        task_id: The ID of the task to find

    Returns:
        The Task object if found, None otherwise
    """
    for task in tasks:
        if task.id == task_id:
            return task
    return None


def get_all_tasks() -> List[Task]:
    """
    Get all tasks from storage.

    Returns:
        List of all Task objects in storage
    """
    return tasks.copy()


def remove_task_from_storage(task_id: int) -> bool:
    """
    Remove a task from storage by ID.

    Args:
        task_id: The ID of the task to remove

    Returns:
        True if the task was found and removed, False otherwise
    """
    global tasks
    original_length = len(tasks)
    tasks = [task for task in tasks if task.id != task_id]
    return len(tasks) != original_length


def update_task_in_storage(updated_task: Task) -> bool:
    """
    Update an existing task in storage.

    Args:
        updated_task: The Task object with updated information

    Returns:
        True if the task was found and updated, False otherwise
    """
    for i, task in enumerate(tasks):
        if task.id == updated_task.id:
            tasks[i] = updated_task
            return True
    return False


def validate_title(title: str) -> Union[str, ValueError]:
    """
    Validate a task title according to requirements.

    Args:
        title: The title to validate

    Returns:
        The validated title if valid

    Raises:
        ValueError: If the title is invalid
    """
    if not isinstance(title, str):
        raise ValueError("Title must be a string")

    if not title.strip():
        raise ValueError("Title cannot be empty or contain only whitespace")

    if len(title.strip()) < 1 or len(title.strip()) > 200:
        raise ValueError(f"Title must be between 1 and 200 characters, got {len(title.strip())}")

    return title.strip()


def validate_description(description: str) -> Union[str, ValueError]:
    """
    Validate a task description according to requirements.

    Args:
        description: The description to validate

    Returns:
        The validated description if valid

    Raises:
        ValueError: If the description is invalid
    """
    if not isinstance(description, str):
        raise ValueError("Description must be a string")

    if len(description) > 1000:
        raise ValueError(f"Description must be 1000 characters or less, got {len(description)}")

    return description.strip()