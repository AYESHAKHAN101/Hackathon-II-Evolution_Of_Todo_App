# Data Model: Backend for Todo Application with FastAPI

## Task Entity
- **id**: integer - Auto-incrementing primary key for the task
- **user_id**: string - UUID or unique identifier of the user who owns the task (indexed for performance)
- **title**: string - Task title (required, max 255 characters)
- **description**: string - Optional task description (max 1000 characters)
- **completed**: boolean - Completion status (default: False)
- **position**: integer - Ordering position for drag-and-drop arrangement (indexed for ordering)
- **created_at**: DateTime - Timestamp of task creation (auto-populated)
- **updated_at**: DateTime - Timestamp of last update (auto-populated and updated on changes)

## Validation Rules
- **Title**: Required field, minimum 1 character, maximum 255 characters
- **Description**: Optional field, maximum 1000 characters if provided
- **Completed**: Boolean field, defaults to False
- **Position**: Integer value, used for ordering tasks (ascending order)
- **user_id**: String identifier, validated against JWT token to ensure ownership
- **Timestamps**: Automatically managed by the system, not by user input

## Relationships
- **Task to User**: Many-to-one relationship (many tasks belong to one user)
- The user_id field connects each task to its owner through the JWT-authenticated user ID

## Indexes
- **user_id**: Indexed for fast filtering of user-specific tasks
- **position**: Indexed for fast ordering of tasks
- **completed**: Potentially indexed if frequent filtering by completion status is needed

## State Transitions
- **Incomplete → Complete**: When user marks task as done via PATCH /api/{user_id}/tasks/{id}/complete
- **Complete → Incomplete**: When user reopens completed task via PATCH /api/{user_id}/tasks/{id}/complete
- **Position Updates**: When user reorders tasks via PUT /api/{user_id}/tasks/{id} with new position

## Constraints
- **Ownership Constraint**: Each task can only be accessed/modified by the user whose user_id matches the token's user_id
- **User Isolation**: Queries automatically filter tasks by the authenticated user's ID
- **Data Integrity**: Required fields are enforced at both API and database levels

## Lifecycle Management
- **Creation**: Tasks are created with default values (completed=False, current timestamp for created_at/updated_at)
- **Updates**: updated_at is automatically updated on any modification
- **Deletion**: Tasks are completely removed from database on DELETE request
- **Archival**: No archival strategy; deleted tasks are permanently removed