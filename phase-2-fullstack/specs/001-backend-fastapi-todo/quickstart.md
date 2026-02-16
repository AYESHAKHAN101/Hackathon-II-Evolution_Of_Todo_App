# Quickstart Guide: Backend for Todo Application with FastAPI

## Prerequisites
- Python 3.11+
- Poetry or pip for dependency management
- PostgreSQL (or Neon Serverless PostgreSQL)
- Better Auth for frontend JWT generation

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to backend directory
```bash
cd backend
```

### 3. Create virtual environment and install dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-secret-key-for-jwt-verification
FRONTEND_URL=http://localhost:3000  # Origin for CORS
DEBUG=true  # Set to false for production
```

### 5. Database Setup
Initialize the database with the required tables:
```bash
# The application will automatically create tables on startup
# Alternatively, use alembic if migrations are set up:
alembic upgrade head
```

### 6. Start the development server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

## Key Features

### Authentication
- JWT tokens issued by Better Auth are verified automatically
- Protected routes validate JWT in Authorization header
- User isolation enforced on every request

### Task Management
- Full CRUD operations for tasks
- Position-based ordering for drag-and-drop
- Completion status toggle endpoint
- Filtering and pagination for task lists

### Security
- All endpoints require valid JWT tokens
- User isolation prevents cross-user data access
- SQL injection protection through parameterized queries
- CORS configured for frontend origin only

## API Endpoints

### Base URL
All API endpoints are prefixed with `/api/{user_id}/` where `user_id` comes from the authenticated JWT.

### Available Endpoints
- `GET /api/{user_id}/tasks` - List all user tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion

## Folder Structure
```
backend/
├── main.py              # App entry point with FastAPI instance
├── db.py                # Database connection and session management
├── models.py            # SQLModel models (Task entity)
├── auth.py              # JWT verification utilities
├── settings.py          # Environment configuration and settings
├── schemas.py           # Pydantic request/response models
├── routes/
│   └── tasks.py         # Task CRUD routes implementation
├── middleware/
│   └── auth_middleware.py # Authentication middleware
├── utils/
│   └── validators.py    # Request validation utilities
├── requirements.txt     # Python dependencies
├── pyproject.toml       # Project configuration
├── README.md            # Backend documentation
└── CLAUDE.md            # Backend development guidelines
```

## Running Tests
```bash
# Run unit tests
pytest tests/unit

# Run integration tests
pytest tests/integration

# Run all tests
pytest
```

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string (asyncpg driver)
- `BETTER_AUTH_SECRET` - Secret key to verify Better Auth JWT signatures

### Optional
- `FRONTEND_URL` - Origin for CORS (default: http://localhost:3000)
- `DEBUG` - Enable/disable debug mode (default: false)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - JWT token expiration (default: 30 minutes)

## Development Workflow

### Adding a New Endpoint
1. Define the request/response models in `schemas.py`
2. Add the route to the appropriate file in `routes/`
3. Add authentication dependency using the JWT verification utilities
4. Implement business logic with user isolation
5. Add tests in the `tests/` directory

### Database Changes
1. Modify the models in `models.py`
2. Create a migration with Alembic (if migrations are implemented)
3. Test the changes locally
4. Update the documentation if needed

## Production Deployment
```bash
# Use a production WSGI server like Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Troubleshooting

### Common Issues
1. **JWT Validation Errors**: Ensure `BETTER_AUTH_SECRET` matches the frontend Better Auth configuration
2. **Database Connection Issues**: Verify `DATABASE_URL` and network connectivity
3. **CORS Errors**: Check `FRONTEND_URL` in environment variables
4. **User Isolation Issues**: Verify JWT tokens contain the correct `user_id` claim

### Development Mode Features
- Auto-reload on file changes with `--reload` flag
- Interactive API documentation at `/docs` and `/redoc`
- Detailed error messages when `DEBUG=true`