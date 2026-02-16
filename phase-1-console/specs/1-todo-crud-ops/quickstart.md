# Quickstart Guide: Basic Task CRUD Operations

## Prerequisites
- Python 3.13+ installed
- No external dependencies required

## Setup
1. Clone or download the repository
2. Navigate to the project directory
3. Ensure Python 3.13+ is available in your environment

## Running the Application
```bash
cd src/cli
python main.py
```

## Basic Usage
1. Run the application using the command above
2. Select operations from the main menu:
   - Option 1: Add new task
   - Option 2: View all tasks
   - Option 3: Update task
   - Option 4: Delete task
   - Option 5: Toggle task completion
   - Option 0: Exit application
3. Follow the prompts for each operation
4. Input validation will guide you if incorrect data is entered

## Example Workflow
1. Choose "Add new task" to create your first task
2. Enter a title (1-200 characters)
3. Optionally enter a description (up to 1000 characters)
4. Use "View all tasks" to see your task list
5. Use other operations to manage your tasks as needed

## Error Handling
- Invalid menu choices will show an error and return to the main menu
- Invalid task IDs will show an error and allow re-entry
- Invalid titles (empty or too long) will show an error and allow re-entry
- Non-numeric inputs where numbers are expected will show an error and allow re-entry

## Notes
- All data is stored in memory only and will be lost when the application exits
- The application follows a menu-driven interface using input() and print() only
- All operations provide clear feedback on success or failure