"""
Main CLI interface for the todo application.
This module contains the main menu loop and user interaction handlers.

Based on task T012: Create add_task_menu function in src/cli/main.py
Based on task T014: Create get_all_tasks function in src/services/task_operations.py (already implemented)
Based on task T015: Create format_tasks_display function in src/services/task_operations.py (already implemented)
Based on task T016: Create view_tasks_menu function in src/cli/main.py
Based on task T021: Create toggle_completion_menu function in src/cli/main.py
Based on task T026: Create update_task_menu function in src/cli/main.py
Based on task T030: Create delete_task_menu function in src/cli/main.py
Based on task T034: Create main menu loop in src/cli/main.py
Based on task T037: Create graceful exit functionality in src/cli/main.py
"""

from typing import Optional
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from services.task_operations import (
    add_task, get_task_input, get_all_tasks_sorted, format_tasks_display,
    toggle_task_completion, get_task_by_id, get_update_input, update_task,
    delete_task
)


def add_task_menu():
    """Handle the add task menu option."""
    print("\n--- Add New Task ---")
    title, description = get_task_input()

    if title is not None:
        task = add_task(title, description)
        if task:
            print(f"Task added successfully with ID: {task.id}")
        else:
            print("Failed to add task. Please check your input.")


def view_tasks_menu():
    """Handle the view tasks menu option."""
    print("\n--- All Tasks ---")
    tasks = get_all_tasks_sorted()

    if not tasks:
        print("No tasks yet.")
    else:
        formatted_output = format_tasks_display(tasks)
        print(formatted_output)


def toggle_completion_menu():
    """Handle the toggle completion menu option."""
    print("\n--- Toggle Task Completion ---")
    try:
        task_id_str = input("Enter task ID to toggle completion: ").strip()
        task_id = int(task_id_str)

        task = get_task_by_id(task_id)
        if not task:
            print(f"Task with ID {task_id} not found.")
            return

        success = toggle_task_completion(task_id)
        if success:
            updated_task = get_task_by_id(task_id)
            status = "completed" if updated_task.completed else "incomplete"
            print(f"Task #{task_id} marked as {status}.")
        else:
            print("Failed to toggle task completion status.")
    except ValueError:
        print("Invalid task ID. Please enter a number.")
    except Exception as e:
        print(f"Error toggling task completion: {e}")


def update_task_menu():
    """Handle the update task menu option."""
    print("\n--- Update Task ---")
    try:
        task_id_str = input("Enter task ID to update: ").strip()
        task_id = int(task_id_str)

        task = get_task_by_id(task_id)
        if not task:
            print(f"Task with ID {task_id} not found.")
            return

        new_title, new_description = get_update_input(task)

        if new_title is not None and new_description is not None:
            success = update_task(task_id, new_title, new_description)
            if success:
                print(f"Task #{task_id} updated successfully.")
            else:
                print("Failed to update task. Please check your input.")
    except ValueError:
        print("Invalid task ID. Please enter a number.")
    except Exception as e:
        print(f"Error updating task: {e}")


def delete_task_menu():
    """Handle the delete task menu option."""
    print("\n--- Delete Task ---")
    try:
        task_id_str = input("Enter task ID to delete: ").strip()
        task_id = int(task_id_str)

        task = get_task_by_id(task_id)
        if not task:
            print(f"Task with ID {task_id} not found.")
            return

        # Confirmation prompt
        confirm = input(f"Are you sure you want to delete task '#{task_id}' ({task.title})? (y/N): ").strip().lower()
        if confirm in ['y', 'yes']:
            success = delete_task(task_id)
            if success:
                print(f"Task #{task_id} deleted successfully.")
            else:
                print("Failed to delete task.")
        else:
            print("Deletion cancelled.")
    except ValueError:
        print("Invalid task ID. Please enter a number.")
    except Exception as e:
        print(f"Error deleting task: {e}")


def display_menu():
    """Display the main menu options."""
    print("\n" + "="*40)
    print("         TODO APPLICATION")
    print("="*40)
    print("1. Add new task")
    print("2. View all tasks")
    print("3. Update task")
    print("4. Delete task")
    print("5. Toggle task completion")
    print("0. Exit")
    print("="*40)


def main_menu_loop():
    """Main menu loop that runs until user chooses to exit."""
    print("Welcome to the Todo Application!")

    while True:
        display_menu()

        try:
            choice = input("Select an option (0-5): ").strip()

            if choice == "0":
                print("Thank you for using the Todo Application. Goodbye!")
                break
            elif choice == "1":
                add_task_menu()
            elif choice == "2":
                view_tasks_menu()
            elif choice == "3":
                update_task_menu()
            elif choice == "4":
                delete_task_menu()
            elif choice == "5":
                toggle_completion_menu()
            else:
                print("Invalid option. Please select a number between 0 and 5.")

        except KeyboardInterrupt:
            print("\n\nOperation cancelled by user. Exiting...")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            print("Please try again.")


def main():
    """Entry point for the application."""
    main_menu_loop()


if __name__ == "__main__":
    main()