# Todo Application - Phase I

This is a console-based todo application that implements the core CRUD operations with in-memory storage. The application follows a menu-driven interface and provides all required functionality as specified in the project requirements.

## Features

- **Add Tasks**: Create new tasks with title (1-200 characters) and optional description (up to 1000 characters)
- **View Tasks**: Display all tasks in a formatted table showing ID, title, status, and description
- **Update Tasks**: Modify existing task title and/or description
- **Delete Tasks**: Remove tasks with confirmation prompt
- **Toggle Completion**: Mark tasks as complete/incomplete

## Requirements

- Python 3.13+ (pure Python, no external dependencies)

## How to Run

1. Clone or download the repository
2. Navigate to the project directory
3. Run the application:

```bash
python3 src/cli/main.py
```

## Usage

The application presents a menu-driven interface with the following options:

1. **Add new task**: Create a new task with title and optional description
2. **View all tasks**: Display all existing tasks with their status
3. **Update task**: Modify an existing task by ID
4. **Delete task**: Remove a task by ID with confirmation
5. **Toggle task completion**: Switch completion status of a task by ID
0. **Exit**: Quit the application

## Project Structure

```
src/
├── models/
│   └── task.py          # Task data model and in-memory storage
├── services/
│   └── task_operations.py # Business logic for task operations
└── cli/
    └── main.py          # Menu-driven interface and main loop
```

## Implementation Details

- **Data Storage**: In-memory using Python lists (lost when application exits)
- **Validation**: Input validation for titles (1-200 chars) and descriptions (≤1000 chars)
- **Error Handling**: Proper error messages and graceful handling of invalid inputs
- **Architecture**: Clean separation of concerns (data model, business logic, UI)

## Testing

The application has been tested to ensure all 5 core operations work correctly. A test script is included (`test_todo_app.py`) that validates all functionality without user interaction.