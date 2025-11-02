from abc import ABC, abstractmethod
import httpx
from typing import Dict, Any

class BaseCrawler(ABC):
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.token = None

    @abstractmethod
    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Login to the API and return the full response
        Returns: Dict containing token and user data
        """
        pass

    @abstractmethod
    async def get_deals(self, token: str) -> Dict[str, Any]:
        """
        Get deals list using the authentication token
        Returns: Dict containing deals data
        """
        pass