from typing import Optional
from fastapi import HTTPException, status


def validate_task_title(title: Optional[str]) -> bool:
    """
    Validates task title according to business rules:
    - Required field
    - Minimum 1 character
    - Maximum 255 characters
    """
    if title is None:
        return False

    title_str = str(title).strip()
    if len(title_str) < 1 or len(title_str) > 255:
        return False

    return True


def validate_task_description(description: Optional[str]) -> bool:
    """
    Validates task description according to business rules:
    - Optional field
    - Maximum 1000 characters if provided
    """
    if description is None:
        return True  # Description is optional

    description_str = str(description)
    if len(description_str) > 1000:
        return False

    return True


def validate_task_position(position: Optional[int]) -> bool:
    """
    Validates task position according to business rules:
    - Optional field
    - Must be a valid integer if provided
    """
    if position is None:
        return True  # Position is optional

    try:
        pos_int = int(position)
        return True
    except (ValueError, TypeError):
        return False