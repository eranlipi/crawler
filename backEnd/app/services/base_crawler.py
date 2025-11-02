from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple


class BaseCrawler(ABC):
    """Abstract base class for site crawlers"""
    
    @abstractmethod
    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Login to the website
        
        Args:
            email: User email
            password: User password
            
        Returns:
            Login response with token and user data
        """
        pass
    
    @abstractmethod
    async def get_deals(self, token: str) -> Dict[str, Any]:
        """
        Get list of deals
        
        Args:
            token: Authentication token
            
        Returns:
            Deals response
        """
        pass
    
    @abstractmethod
    async def get_deal_folders(self, deal_id: int, token: str) -> Dict[str, Any]:
        """
        Get folders for a specific deal
        
        Args:
            deal_id: Deal ID
            token: Authentication token
            
        Returns:
            Folders response
        """
        pass
    
    @abstractmethod
    async def get_deal_files(self, deal_id: int, token: str) -> Dict[str, Any]:
        """
        Get files for a specific deal
        
        Args:
            deal_id: Deal ID
            token: Authentication token
            
        Returns:
            Files response
        """
        pass
    
    @abstractmethod
    async def download_file(self, file_id: int, token: str) -> Tuple[bytes, str]:
        """
        Download a file
        
        Args:
            file_id: File ID
            token: Authentication token
            
        Returns:
            Tuple of (file_content, filename)
        """
        pass