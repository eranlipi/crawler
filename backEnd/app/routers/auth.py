from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from app.models.schemas import (
    LoginRequest,
    LoginResponse,
    DealsResponse
)
from app.services.fo1_crawler import FO1Crawler
from app.services.fo2_crawler import FO2Crawler

router = APIRouter()

# Store active sessions (in production, use Redis or similar)
active_sessions = {}


def get_crawler(website: str):
    """Factory function to get the appropriate crawler"""
    crawlers = {
        "fo1": FO1Crawler(),
        "fo2": FO2Crawler(),
    }
    crawler = crawlers.get(website.lower())
    if not crawler:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported website: {website}"
        )
    return crawler


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Login endpoint that proxies the request to the appropriate site API

    Flow:
    1. Frontend sends credentials with website selection
    2. Backend calls the appropriate external API
    3. Returns the full login response including token and user data
    """
    try:
        crawler = get_crawler(request.website)

        # Call the external API
        response = await crawler.login(request.email, request.password)

        # Store the token for this session
        if response.get("success", {}).get("token"):
            token = response["success"]["token"]
            active_sessions[token] = {
                "website": request.website,
                "email": request.email
            }

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )


@router.post("/deals-list", response_model=DealsResponse)
async def get_deals(authorization: Optional[str] = Header(None)):
    """
    Get deals list endpoint

    Flow:
    1. Frontend sends request with Authorization header (Bearer token)
    2. Backend extracts token and calls the appropriate external API
    3. Returns the deals list
    """
    try:
        # Extract token from Authorization header
        if not authorization:
            raise HTTPException(
                status_code=401,
                detail="Authorization header is required"
            )

        # Handle "Bearer <token>" format
        token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization

        # Get session info
        session = active_sessions.get(token)
        if not session:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )

        # Get the appropriate crawler
        crawler = get_crawler(session["website"])

        # Call the external API
        response = await crawler.get_deals(token)

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch deals: {str(e)}"
        )


@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """
    Logout endpoint to clear the session
    """
    try:
        if authorization:
            token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
            if token in active_sessions:
                del active_sessions[token]

        return {"message": "Logged out successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Logout failed: {str(e)}"
        )
