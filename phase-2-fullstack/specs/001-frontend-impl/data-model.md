# Data Model: Frontend Implementation for Todo App

## User Entity
- **id**: string - Unique identifier for the user
- **email**: string - User's email address with validation
- **password**: string - User's password with minimum 8 characters, mixed case, and number
- **createdAt**: Date - Account creation timestamp
- **lastLoginAt**: Date - Last login timestamp
- **sessionTimeout**: number - Session timeout duration (30 minutes as per spec)

## Task Entity
- **id**: string - Unique identifier for the task
- **title**: string - Task title (required)
- **description**: string - Task description (optional)
- **completed**: boolean - Completion status (default: false)
- **position**: number - Ordering position for drag-and-drop arrangement
- **userId**: string - Reference to the owning user
- **createdAt**: Date - Task creation timestamp
- **updatedAt**: Date - Last update timestamp
- **completedAt**: Date - Completion timestamp (optional)

## Session Entity
- **jwtToken**: string - JWT token for API authentication
- **expiresAt**: Date - Token expiration time (based on 30-min timeout)
- **refreshToken**: string - Optional refresh token for session extension

## API Response Models

### Task List Response
- **data**: Array<Task> - Array of user's tasks
- **meta**: Object - Pagination and filtering metadata
  - totalCount: number
  - currentPage: number
  - totalPages: number

### Task Creation Response
- **data**: Task - Created task object
- **success**: boolean - Operation success status

### Authentication Response
- **user**: User - User object upon successful auth
- **jwtToken**: string - JWT token for subsequent API calls
- **expiresIn**: number - Token validity period in seconds

## Validation Rules
- User email: Valid email format using standard regex pattern
- User password: Minimum 8 characters with mixed case and number
- Task title: Required, maximum 255 characters
- Task description: Optional, maximum 1000 characters
- Position: Integer value for ordering tasks

## State Transitions

### Task States
- **Pending** → **Completed**: When user marks task as done
- **Completed** → **Pending**: When user reopens completed task

### Session States
- **Logged Out** → **Logged In**: Upon successful authentication
- **Logged In** → **Expired**: When JWT token expires (30 min)
- **Expired** → **Logged Out**: Automatic logout on token expiration