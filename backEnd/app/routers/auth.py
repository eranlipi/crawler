from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from io import BytesIO
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


def get_token_from_header(authorization: Optional[str]) -> str:
    """Extract token from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing authorization header"
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format"
        )
    
    token = authorization.replace("Bearer ", "")
    
    if token not in active_sessions:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    
    return token

@router.post("/login")
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

        # Store the token for this session (handle both response formats)
        token = None
        if "success" in response and "token" in response.get("success", {}):
            token = response["success"]["token"]
        elif "token" in response:
            token = response["token"]

        if token:
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

@router.get("/deals/{deal_id}/files")
async def get_deal_files(
    deal_id: int,
    authorization: Optional[str] = Header(None)
):
    """
    Get files for a specific deal
    
    Args:
        deal_id: The ID of the deal
        authorization: Bearer token
        
    Returns:
        JSON with files list
    """
    try:
        token = get_token_from_header(authorization)
        session = active_sessions[token]
        
        crawler = get_crawler(session["website"])
        files = await crawler.get_deal_files(deal_id, token)
        
        return files
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch deal files: {str(e)}"
        )


@router.get("/deals/{deal_id}/folders")
async def get_deal_folders(
    deal_id: int,
    authorization: Optional[str] = Header(None)
):
    """
    Get folder structure for a specific deal
    
    Args:
        deal_id: The ID of the deal
        authorization: Bearer token
        
    Returns:
        JSON with folders data
    """
    try:
        token = get_token_from_header(authorization)
        session = active_sessions[token]
        
        crawler = get_crawler(session["website"])
        folders = await crawler.get_deal_folders(deal_id, token)
        
        return folders
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch deal folders: {str(e)}"
        )


@router.get("/download-file")
async def download_file(
    file_url: str,
    filename: str,
    authorization: Optional[str] = Header(None)
):
    """
    Download a file from a deal
    
    Args:
        file_url: Full URL of the file to download
        filename: Original filename for download
        authorization: Bearer token
        
    Returns:
        File as streaming response
    """
    try:
        token = get_token_from_header(authorization)
        session = active_sessions[token]
        
        crawler = get_crawler(session["website"])
        file_content = await crawler.download_file(file_url, token)
        
        # Return file as streaming response
        return StreamingResponse(
            BytesIO(file_content),
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to download file: {str(e)}"
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
