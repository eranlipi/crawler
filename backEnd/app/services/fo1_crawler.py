import httpx
from typing import Dict, Any, Tuple
from fastapi import HTTPException
from app.services.base_crawler import BaseCrawler


class FO1Crawler(BaseCrawler):
    """Crawler for fo1.altius.finance"""
    
    BASE_URL = "https://fo1.altius.finance"
    
    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """Login to FO1"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.BASE_URL}/api/v2/auth/login",
                    json={
                        "email": email,
                        "password": password
                    },
                    headers={
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                )
                
                if response.status_code == 401:
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid credentials"
                    )
                
                response.raise_for_status()
                return response.json()
                
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Login failed: {str(e)}"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Could not connect to FO1: {str(e)}"
            )
    
    async def get_deals(self, token: str) -> Dict[str, Any]:
        """Get deals from FO1"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.BASE_URL}/api/v2/deals/list",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Accept": "application/json"
                    }
                )
                
                response.raise_for_status()
                return response.json()
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Failed to get deals: {str(e)}"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Could not connect to FO1: {str(e)}"
            )
    
    async def get_deal_folders(self, deal_id: int, token: str) -> Dict[str, Any]:
        """Get folders for a deal from FO1"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.BASE_URL}/api/v2/deals/{deal_id}/folders",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Accept": "application/json"
                    }
                )
                
                response.raise_for_status()
                return response.json()
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Failed to get folders: {str(e)}"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Could not connect to FO1: {str(e)}"
            )
    
    async def get_deal_files(self, deal_id: int, token: str) -> Dict[str, Any]:
        """Get files for a deal from FO1"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.BASE_URL}/api/v2/deals/{deal_id}/files",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Accept": "application/json"
                    }
                )
                
                response.raise_for_status()
                return response.json()
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Failed to get files: {str(e)}"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Could not connect to FO1: {str(e)}"
            )
    
    async def download_file(self, file_id: int, token: str) -> Tuple[bytes, str]:
        """Download a file from FO1"""
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.get(
                    f"{self.BASE_URL}/api/v2/files/{file_id}/download",
                    headers={
                        "Authorization": f"Bearer {token}",
                    },
                    follow_redirects=True
                )
                
                response.raise_for_status()
                
                # Extract filename from Content-Disposition header
                content_disposition = response.headers.get("Content-Disposition", "")
                filename = "download"
                if "filename=" in content_disposition:
                    filename = content_disposition.split("filename=")[1].strip('"')
                
                return response.content, filename
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Failed to download file: {str(e)}"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Could not connect to FO1: {str(e)}"
            )