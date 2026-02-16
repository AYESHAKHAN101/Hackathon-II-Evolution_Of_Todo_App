import time
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from settings import settings
from schemas import JWTPayload


security = HTTPBearer()


def verify_jwt_token(token: str) -> Optional[JWTPayload]:
    """
    Verify JWT token and return payload if valid
    """
    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=["HS256"]
        )

        # Check if token is expired (redundant with jose's built-in check, but kept for explicit error message)
        exp = payload.get("exp")
        if exp and exp < time.time():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "code": "UNAUTHORIZED",
                    "message": "Token has expired",
                    "details": {}
                }
            )

        return JWTPayload(**payload)

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "UNAUTHORIZED",
                "message": "Could not validate credentials",
                "details": {}
            }
        )


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> JWTPayload:
    """
    Get current user from JWT token in Authorization header
    """
    return verify_jwt_token(credentials.credentials)