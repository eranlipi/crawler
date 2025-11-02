import httpx
from .base_crawler import BaseCrawler
from typing import Dict, Any

class FO2Crawler(BaseCrawler):
    def __init__(self):
        super().__init__("https://fo2.api.altius.finance")
        # Use a persistent client to maintain cookies across requests
        self.client = None
    
    def get_client(self, token: str) -> httpx.AsyncClient:
        """Get or create a client for this token with cookie support"""
        if self.client is None:
            self.client = httpx.AsyncClient(
                cookies={"Authorization2": token},
                follow_redirects=True
            )
        return self.client

    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Login to FO2 Altius Finance API
        Returns the full response including token and user data
        """
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.post(
                f"{self.base_url}/api/v0.0.2/login",
                json={"email": email, "password": password},
                headers={"Content-Type": "application/json"}
            )

            if response.status_code != 200:
                # Get detailed error information
                try:
                    error_data = response.json()
                    error_msg = f"FO2 API returned {response.status_code}: {error_data}"
                except:
                    error_msg = f"FO2 API returned {response.status_code}: {response.text}"
                raise Exception(error_msg)

            return response.json()

    async def get_deals(self, token: str) -> Dict[str, Any]:
        """
        Get deals list using the authentication token
        """
        async with httpx.AsyncClient(
            cookies={"Authorization2": token},
            follow_redirects=True
        ) as client:
            response = await client.post(
                f"{self.base_url}/api/v0.0.2/deals-list",
                json={"view": "task-manage"},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code != 200:
                try:
                    error_data = response.json()
                    error_msg = f"FO2 API returned {response.status_code}: {error_data}"
                except:
                    error_msg = f"FO2 API returned {response.status_code}: {response.text}"
                raise Exception(error_msg)
            
            return response.json()

    async def get_deal_files(self, deal_id: int, token: str) -> Dict[str, Any]:
        """
        Get files for a specific deal and transform to array format
        
        Returns:
            Dictionary with files list and metadata
        """
        async with httpx.AsyncClient(
            cookies={"Authorization2": token},
            follow_redirects=True
        ) as client:
            response = await client.get(
                f"{self.base_url}/api/v0.0.3/deals/{deal_id}/files"
            )
            try:
                response.raise_for_status()
                data = response.json()
                
                # Transform object to array
                if isinstance(data.get("data"), dict):
                    files_array = []
                    for file_id, file_data in data["data"].items():
                        # Map API fields to our expected format
                        files_array.append({
                            "id": file_data.get("id"),
                            "name": file_data.get("name"),
                            "size": file_data.get("size_in_bytes", 0),
                            "mime_type": file_data.get("type", "unknown"),
                            "url": file_data.get("file_url"),
                            "created_at": file_data.get("created_at"),
                        })
                    return {"data": files_array, "message": data.get("message", "Success")}
                
                return data
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    # No files found for this deal
                    return {"data": [], "message": "No files found"}
                raise Exception(f"Failed to fetch files: {response.status_code}")

    async def download_file(self, file_url: str, token: str) -> bytes:
        """
        Download a file from the deal
        
        Args:
            file_url: Full URL of the file (e.g., from files API response)
            token: Authentication token
            
        Returns:
            File content as bytes
        """
        async with httpx.AsyncClient(
            cookies={"Authorization2": token},
            timeout=60.0,
            follow_redirects=True
        ) as client:
            response = await client.get(file_url)
            response.raise_for_status()
            return response.content
    
    async def get_deal_folders(self, deal_id: int, token: str) -> Dict[str, Any]:
        """
        Get folder structure for a specific deal
        
        Args:
            deal_id: The ID of the deal
            token: Authentication token
            
        Returns:
            Dictionary with folders data
        """
        async with httpx.AsyncClient(
            cookies={"Authorization2": token},
            follow_redirects=True
        ) as client:
            response = await client.get(
                f"{self.base_url}/api/v0.0.3/deals/{deal_id}/folders"
            )
            response.raise_for_status()
            return response.json()
