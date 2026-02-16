"""
Task operations for the todo application.
This module contains functions for adding, updating, deleting, and viewing tasks.

Based on task T009: Create add_task function in src/services/task_operations.py
Based on task T010: Create get_task_input function in src/services/task_operations.py
Based on task T011: Implement input validation for task creation in src/services/task_operations.py
"""

from typing import Dict, List, Optional, Tuple
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.task import (
    Task, add_task_to_storage, get_next_id, increment_next_id,
    find_task_by_id, get_all_tasks, remove_task_from_storage,
    update_task_in_storage, validate_title, validate_description
)


def add_task(title: str, description: str = "") -> Optional[Task]:
    """
    Add a new task to the system.

    Args:
        title: The title of the task (required, 1-200 characters)
        description: Optional description of the task (max 1000 characters)

    Returns:
        The created Task object if successful, None otherwise
    """
    try:
        # Validate inputs
        validated_title = validate_title(title)
        validated_description = validate_description(description)

        # Create new task with next available ID
        task_id = get_next_id()
        new_task = Task(task_id, validated_title, validated_description, completed=False)

        # Add to storage
        add_task_to_storage(new_task)

        # Increment the next ID counter
        increment_next_id()

        return new_task
    except ValueError as e:
        print(f"Error adding task: {e}")
        return None


def get_task_input() -> Tuple[Optional[str], Optional[str]]:
    """
    Get task input from user interactively.

    Returns:
        A tuple containing (title, description) or (None, None) if cancelled
    """
    try:
        print("\n--- Add New Task ---")
        title = input("Enter task title (1-200 characters): ").strip()

        if not title:
            print("Task title cannot be empty.")
            return None, None

        description = input("Enter task description (optional, press Enter to skip): ").strip()

        return title, description
    except KeyboardInterrupt:
        print("\nOperation cancelled.")
        return None, None
    except Exception as e:
        print(f"Error getting input: {e}")
        return None, None


def get_all_tasks_sorted() -> List[Task]:
    """
    Get all tasks sorted by ID.

    Returns:
        List of all Task objects sorted by ID
    """
    all_tasks = get_all_tasks()
    return sorted(all_tasks, key=lambda task: task.id)


def toggle_task_completion(task_id: int) -> bool:
    """
    Toggle the completion status of a task.

    Args:
        task_id: The ID of the task to toggle

    Returns:
        True if the task was found and toggled, False otherwise
    """
    task = find_task_by_id(task_id)
    if task:
        task.completed = not task.completed
        return update_task_in_storage(task)
    return False


def update_task(task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
    """
    Update an existing task.

    Args:
        task_id: The ID of the task to update
        title: New title (optional)
        description: New description (optional)

    Returns:
        True if the task was found and updated, False otherwise
    """
    task = find_task_by_id(task_id)
    if not task:
        return False

    # Use existing values if new values are not provided
    new_title = title if title is not None else task.title
    new_description = description if description is not None else task.description

    try:
        # Validate the new values
        validated_title = validate_title(new_title)
        validated_description = validate_description(new_description)

        # Create updated task
        updated_task = Task(
            task_id=task_id,
            title=validated_title,
            description=validated_description,
            completed=task.completed
        )

        # Update in storage
        return update_task_in_storage(updated_task)
    except ValueError as e:
        print(f"Error updating task: {e}")
        return False


def delete_task(task_id: int) -> bool:
    """
    Delete a task by ID.

    Args:
        task_id: The ID of the task to delete

    Returns:
        True if the task was found and deleted, False otherwise
    """
    return remove_task_from_storage(task_id)


def get_task_by_id(task_id: int) -> Optional[Task]:
    """
    Get a specific task by its ID.

    Args:
        task_id: The ID of the task to retrieve

    Returns:
        The Task object if found, None otherwise
    """
    return find_task_by_id(task_id)


def format_tasks_display(tasks_list: List[Task]) -> str:
    """
    Format a list of tasks for display.

    Args:
        tasks_list: List of Task objects to format

    Returns:
        Formatted string representation of the tasks
    """
    if not tasks_list:
        return "No tasks yet."

    header = f"{'ID':<4} {'Title':<25} {'Status':<8} {'Description'}"
    separator = "-" * 70
    lines = [header, separator]

    for task in tasks_list:
        status = "✓" if task.completed else "☐"
        title = task.title[:23] + ".." if len(task.title) > 25 else task.title
        description = task.description[:30] + ".." if len(task.description) > 30 else task.description
        line = f"{task.id:<4} {title:<25} {status:<8} {description}"
        lines.append(line)

    return "\n".join(lines)


def get_update_input(current_task: Task) -> Tuple[Optional[str], Optional[str]]:
    """
    Get update input from user interactively.

    Args:
        current_task: The current task being updated

    Returns:
        A tuple containing (new_title, new_description) or (None, None) if cancelled
    """
    try:
        print(f"\n--- Update Task #{current_task.id} ---")
        print(f"Current title: {current_task.title}")
        print(f"Current description: {current_task.description}")

        new_title = input(f"Enter new title (leave empty to keep '{current_task.title}'): ").strip()
        if new_title == "":
            new_title = current_task.title

        new_description = input(f"Enter new description (leave empty to keep '{current_task.description}'): ").strip()
        if new_description == "":
            new_description = current_task.description

        return new_title, new_description
    except KeyboardInterrupt:
        print("\nOperation cancelled.")
        return None, None
    except Exception as e:
        print(f"Error getting input: {e}")
        return None, None