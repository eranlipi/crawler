import httpx
from .base_crawler import BaseCrawler
from typing import Dict, Any

class FO1Crawler(BaseCrawler):
    def __init__(self):
        super().__init__("https://fo1.api.altius.finance")

    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Login to FO1 Altius Finance API
        Returns the full response including token and user data
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v0.0.2/login",
                json={"email": email, "password": password},
                headers={"Content-Type": "application/json"}
            )
            try:
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                # Try to get the response body for better error messages
                try:
                    error_detail = response.json()
                    raise Exception(f"API error: {response.status_code} - {error_detail}")
                except:
                    raise Exception(f"API error: {response.status_code} - {response.text}")

    async def get_deals(self, token: str) -> Dict[str, Any]:
        """
        Get deals list using the authentication token
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v0.0.2/deals-list",
                headers={"Cookie": f"Authorization2={token}"}
            )
            response.raise_for_status()
            return response.json()