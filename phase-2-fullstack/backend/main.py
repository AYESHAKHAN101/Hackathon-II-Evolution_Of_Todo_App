import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from settings import settings
from db import init_db
import models  # Import models to register them
from routes import auth, tasks
from schemas import HealthResponse
from utils.error_handlers import http_exception_handler
from fastapi.exceptions import HTTPException
from middleware.auth_middleware import AuthMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(title="Todo Backend API", version="1.0.0")

# Register the custom exception handler
app.add_exception_handler(HTTPException, http_exception_handler)

# Middleware order matters: last added = outermost = runs first.
# AuthMiddleware must be added BEFORE CORSMiddleware so that
# CORSMiddleware is outermost and handles preflight OPTIONS requests
# before AuthMiddleware attempts JWT validation.
app.add_middleware(AuthMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    """Initialize the database on startup"""
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully")


# Include the auth routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])

# Include the task routes
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])


@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy")


# Also add a simple root endpoint
@app.get("/")
async def root():
    return {"message": "Todo Backend API is running!"}