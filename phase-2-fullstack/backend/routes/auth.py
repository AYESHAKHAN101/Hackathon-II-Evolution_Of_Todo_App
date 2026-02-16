import logging
import sys
import os

# Add parent directory to path for imports when running directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from db import get_session
from schemas import (
    SignupRequest,
    SigninRequest,
    AuthResponse,
    UserResponse,
    ErrorResponse,
)
from services.auth_service import AuthService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    responses={409: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
async def signup(body: SignupRequest, session: Session = Depends(get_session)):
    """Register a new user account."""

    if body.password != body.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": "VALIDATION_ERROR",
                "message": "Passwords do not match",
                "details": {},
            },
        )

    existing = AuthService.get_user_by_email(session, body.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "CONFLICT",
                "message": "A user with this email already exists",
                "details": {},
            },
        )

    user = AuthService.create_user(session, body.email, body.password)
    token, expires_in = AuthService.create_jwt_token(user.id, user.email)

    logger.info(f"New user registered: {user.email}")

    return AuthResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            createdAt=user.created_at.isoformat(),
        ),
        jwtToken=token,
        expiresIn=expires_in,
    )


@router.post(
    "/signin",
    response_model=AuthResponse,
    responses={401: {"model": ErrorResponse}},
)
async def signin(body: SigninRequest, session: Session = Depends(get_session)):
    """Authenticate an existing user."""

    user = AuthService.get_user_by_email(session, body.email)
    if not user or not AuthService.verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "UNAUTHORIZED",
                "message": "Invalid email or password",
                "details": {},
            },
        )

    AuthService.update_last_login(session, user)
    token, expires_in = AuthService.create_jwt_token(user.id, user.email)

    logger.info(f"User signed in: {user.email}")

    return AuthResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            createdAt=user.created_at.isoformat(),
        ),
        jwtToken=token,
        expiresIn=expires_in,
    )


@router.post("/signout", status_code=status.HTTP_200_OK)
async def signout():
    """Logout the current user (client-side token removal)."""
    return {"success": True}
