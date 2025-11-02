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


def extract_token_from_header(authorization: Optional[str]) -> str:
    """
    Extract and validate Bearer token from Authorization header.

    Args:
        authorization: Authorization header value

    Returns:
        JWT token string

    Raises:
        HTTPException: If authorization header is missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing authorization header"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Expected 'Bearer <token>'"
        )

    token = authorization.replace("Bearer ", "").strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token is empty"
        )

    return token

@router.post("/login")
async def login(request: LoginRequest):
    """
    Login endpoint that proxies the request to the appropriate site API.

    This endpoint is stateless - it simply forwards the login request to the
    external API and returns the response with the website information added.

    Flow:
    1. Frontend sends credentials with website selection
    2. Backend calls the appropriate external API
    3. Returns the login response including token, user data, and website info
    4. Frontend stores both token and website for subsequent requests

    Args:
        request: Login request with website, email, and password

    Returns:
        Login response from external API with added 'website' field

    Raises:
        HTTPException: If login fails
    """
    try:
        crawler = get_crawler(request.website)

        # Call the external API - response format may vary between fo1 and fo2
        response = await crawler.login(request.email, request.password)

        # Add website info to response so frontend knows which API to use
        # The external API's JWT doesn't contain issuer info, so we include it here
        response["website"] = request.website.lower()

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )


@router.post("/deals-list", response_model=DealsResponse)
async def get_deals(
    authorization: Optional[str] = Header(None),
    x_website: Optional[str] = Header(None, alias="X-Website")
):
    """
    Get deals list endpoint.

    This endpoint requires both the authorization token and website identifier.

    Flow:
    1. Extract token from Authorization header
    2. Get website from X-Website header (fo1 or fo2)
    3. Call appropriate external API
    4. Return deals list

    Args:
        authorization: Authorization header with Bearer token
        x_website: X-Website header with website identifier (fo1 or fo2)

    Returns:
        Deals response from external API

    Raises:
        HTTPException: If token or website is invalid, or API call fails
    """
    try:
        # Extract token from header
        token = extract_token_from_header(authorization)

        # Validate website header
        if not x_website:
            raise HTTPException(
                status_code=400,
                detail="Missing X-Website header. Please include the website identifier (fo1 or fo2)"
            )

        website = x_website.lower()

        # Get the appropriate crawler
        crawler = get_crawler(website)

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
    authorization: Optional[str] = Header(None),
    x_website: Optional[str] = Header(None, alias="X-Website")
):
    """
    Get files for a specific deal.

    Args:
        deal_id: The ID of the deal
        authorization: Bearer token
        x_website: X-Website header with website identifier (fo1 or fo2)

    Returns:
        JSON with files list

    Raises:
        HTTPException: If token or website is invalid, or API call fails
    """
    try:
        # Extract token from header
        token = extract_token_from_header(authorization)

        # Validate website header
        if not x_website:
            raise HTTPException(
                status_code=400,
                detail="Missing X-Website header. Please include the website identifier (fo1 or fo2)"
            )

        website = x_website.lower()

        # Get the appropriate crawler and fetch files
        crawler = get_crawler(website)
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
    authorization: Optional[str] = Header(None),
    x_website: Optional[str] = Header(None, alias="X-Website")
):
    """
    Get folder structure for a specific deal.

    Args:
        deal_id: The ID of the deal
        authorization: Bearer token
        x_website: X-Website header with website identifier (fo1 or fo2)

    Returns:
        JSON with folders data

    Raises:
        HTTPException: If token or website is invalid, or API call fails
    """
    try:
        # Extract token from header
        token = extract_token_from_header(authorization)

        # Validate website header
        if not x_website:
            raise HTTPException(
                status_code=400,
                detail="Missing X-Website header. Please include the website identifier (fo1 or fo2)"
            )

        website = x_website.lower()

        # Get the appropriate crawler and fetch folders
        crawler = get_crawler(website)
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
    authorization: Optional[str] = Header(None),
    x_website: Optional[str] = Header(None, alias="X-Website")
):
    """
    Download a file from a deal.

    Args:
        file_url: Full URL of the file to download
        filename: Original filename for download
        authorization: Bearer token
        x_website: X-Website header with website identifier (fo1 or fo2)

    Returns:
        File as streaming response

    Raises:
        HTTPException: If token or website is invalid, or download fails
    """
    try:
        # Extract token from header
        token = extract_token_from_header(authorization)

        # Validate website header
        if not x_website:
            raise HTTPException(
                status_code=400,
                detail="Missing X-Website header. Please include the website identifier (fo1 or fo2)"
            )

        website = x_website.lower()

        # Get the appropriate crawler and download file
        crawler = get_crawler(website)
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
    Logout endpoint.

    In a stateless architecture, logout is essentially a no-op on the backend.
    The client should discard the token. If the external API needs to be notified
    of logout, that would be implemented here in the future.

    Args:
        authorization: Bearer token (optional)

    Returns:
        Success message
    """
    # In a stateless system, there's nothing to clear server-side
    # The client discards the token
    # In the future, we could notify the external API if they have a logout endpoint

    return {"message": "Logged out successfully"}
