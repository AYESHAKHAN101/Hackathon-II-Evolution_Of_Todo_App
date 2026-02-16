# Data Model: Basic Task CRUD Operations

## Task Entity

### Fields
- **id** (integer): Auto-incrementing identifier starting from 1; required; unique
- **title** (string): Task title; required; length 1-200 characters
- **description** (string): Optional task description; nullable; max 1000 characters
- **completed** (boolean): Completion status; default false

### Relationships
- Task List: Collection of Task entities stored in memory as a list

### Validation Rules
- id: Must be positive integer; auto-generated
- title: Required; length between 1-200 characters inclusive; cannot be empty or whitespace only
- description: Optional; if provided, length must be ≤ 1000 characters
- completed: Boolean value only; default to false if not specified

### State Transitions
- New Task: id assigned automatically, completed = false, title/description populated
- Updated Task: title/description modified, id unchanged, completed may change
- Completed Task: completed = true while other fields unchanged
- Deleted Task: removed from task list entirely
- Active Task: completed = false while other fields unchanged

## Task List Collection

### Characteristics
- In-memory storage using Python list
- Maintains insertion order
- No persistence (lost when application exits)
- Thread-unsafe (single-user console application)

### Operations Supported
- Add: Append new task to list
- Read: Retrieve tasks by ID or all tasks
- Update: Modify existing task properties
- Delete: Remove task by ID
- Toggle: Switch completion status