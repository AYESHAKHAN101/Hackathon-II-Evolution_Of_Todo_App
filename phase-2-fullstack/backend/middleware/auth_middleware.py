import sys
import os

# Add parent directory to path for imports when running directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from auth import verify_jwt_token
import re


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to ensure user isolation by validating that the user_id in the URL path
    matches the user_id in the JWT token
    """

    async def dispatch(self, request: Request, call_next):
        # Extract the path to check if it contains user-specific routes
        path = request.url.path

        # Look for patterns like /api/{user_id}/...
        user_id_match = re.search(r'/api/([^/]+)', path)

        if user_id_match:
            path_user_id = user_id_match.group(1)

            # Extract the token from Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return JSONResponse(
                    status_code=403,
                    content={"detail": {"code": "FORBIDDEN", "message": "Not authenticated", "details": {}}}
                )

            token = auth_header.split(" ")[1]

            # Verify the token and get user info
            try:
                jwt_payload = verify_jwt_token(token)
            except HTTPException:
                return JSONResponse(
                    status_code=401,
                    content={"detail": {"code": "UNAUTHORIZED", "message": "Could not validate credentials", "details": {}}}
                )

            token_user_id = jwt_payload.user_id

            # Validate that the user_id in the path matches the one in the token
            if path_user_id != token_user_id:
                return JSONResponse(
                    status_code=403,
                    content={"detail": {"code": "FORBIDDEN", "message": "Access denied: user ID mismatch", "details": {}}}
                )

        response = await call_next(request)
        return response