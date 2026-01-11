#!/usr/bin/env python3
"""
Test script to validate the todo application functionality.
This script tests all 5 core CRUD operations without user interaction.
"""

def test_todo_app():
    print("Testing Todo Application...")

    # Import all necessary modules
    from src.models.task import Task, get_all_tasks, tasks
    from src.services.task_operations import (
        add_task, get_all_tasks_sorted, toggle_task_completion,
        update_task, delete_task, get_task_by_id
    )

    # Clear any existing tasks for a clean test
    global tasks
    tasks.clear()

    print("\n1. Testing ADD functionality...")
    task1 = add_task("Test Task 1", "This is the first test task")
    task2 = add_task("Test Task 2", "This is the second test task")
    if task1 and task2:
        print(f"   ✓ Successfully added tasks: {task1.title}, {task2.title}")
    else:
        print("   ✗ Failed to add tasks")
        return False

    print("\n2. Testing VIEW functionality...")
    all_tasks = get_all_tasks_sorted()
    if len(all_tasks) == 2:
        print(f"   ✓ Retrieved {len(all_tasks)} tasks")
        for task in all_tasks:
            status = "✓" if task.completed else "☐"
            print(f"     ID: {task.id}, Title: {task.title}, Status: {status}")
    else:
        print("   ✗ Failed to retrieve tasks")
        return False

    print("\n3. Testing UPDATE functionality...")
    update_success = update_task(task1.id, "Updated Test Task 1", "Updated description")
    if update_success:
        updated_task = get_task_by_id(task1.id)
        if updated_task and updated_task.title == "Updated Test Task 1":
            print(f"   ✓ Successfully updated task to: {updated_task.title}")
        else:
            print("   ✗ Task update failed")
            return False
    else:
        print("   ✗ Failed to update task")
        return False

    print("\n4. Testing TOGGLE COMPLETION functionality...")
    toggle_success = toggle_task_completion(task1.id)
    if toggle_success:
        toggled_task = get_task_by_id(task1.id)
        if toggled_task and toggled_task.completed:
            print(f"   ✓ Successfully toggled task completion: {toggled_task.title} is now {'completed' if toggled_task.completed else 'incomplete'}")
        else:
            print("   ✗ Task toggle failed")
            return False
    else:
        print("   ✗ Failed to toggle task completion")
        return False

    print("\n5. Testing DELETE functionality...")
    delete_success = delete_task(task2.id)
    if delete_success:
        remaining_tasks = get_all_tasks_sorted()
        if len(remaining_tasks) == 1:
            print(f"   ✓ Successfully deleted task, {len(remaining_tasks)} task remaining")
        else:
            print("   ✗ Task deletion failed")
            return False
    else:
        print("   ✗ Failed to delete task")
        return False

    print("\n✓ All tests passed! The Todo Application is working correctly.")
    return True

if __name__ == "__main__":
    success = test_todo_app()
    if success:
        print("\n🎉 Todo Application implementation is complete and functional!")
    else:
        print("\n❌ Some tests failed.")
        exit(1)