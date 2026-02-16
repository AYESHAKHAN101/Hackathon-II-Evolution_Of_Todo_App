import sys
import os

# Add parent directory to path for imports when running directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from typing import Union
from schemas import ErrorResponse


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Custom handler for HTTP exceptions to return consistent error format
    """
    detail = getattr(exc, 'detail', 'An error occurred')

    # If the route already passed a structured dict, use it directly
    if isinstance(detail, dict) and "code" in detail and "message" in detail:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": detail},
        )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": {
                "code": _get_error_code_from_status(exc.status_code),
                "message": detail if isinstance(detail, str) else str(detail),
                "details": {}
            }
        }
    )


def _get_error_code_from_status(status_code: int) -> str:
    """
    Map HTTP status codes to error codes
    """
    status_to_code = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        422: "VALIDATION_ERROR",
        500: "INTERNAL_SERVER_ERROR"
    }

    return status_to_code.get(status_code, "UNKNOWN_ERROR")