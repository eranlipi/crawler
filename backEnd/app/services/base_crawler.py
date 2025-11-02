from abc import ABC, abstractmethod
import httpx
from typing import Dict, Any

class BaseCrawler(ABC):
    def __init__(self, base_url: str):
        self.base_url = base_url
        # self.token = None

    @abstractmethod
    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Login to the API and return the full response
        """
        pass

    @abstractmethod
    async def get_deals(self, token: str) -> Dict[str, Any]:
        """
        Get deals list using the authentication token
        """
        pass
    @abstractmethod
    async def get_deal_files(self, deal_id: int, token: str) -> Dict[str, Any]:
        """
        Get files for a specific deal
        
        Args:
            deal_id: The ID of the deal
            token: Authentication token
            
        Returns:
            Dictionary with files data
        """
        pass
    
    @abstractmethod
    async def download_file(self, file_url: str, token: str) -> bytes:
        """
        Download a file from the deal
        
        Args:
            file_url: URL of the file to download
            token: Authentication token
            
        Returns:
            File content as bytes
        """
        pass