from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class LoginRequest(BaseModel):
    """Login request model"""
    website: str = Field(..., description="Website identifier (fo1 or fo2)")
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=1, description="User password")


class UserRole(BaseModel):
    """User role model"""
    id: int
    name: str
    presentation_name: str


class UserAccount(BaseModel):
    """User account model"""
    id: int
    name: str
    domain: str


class User(BaseModel):
    """User model"""
    id: int
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: UserRole
    account: UserAccount


class LoginSuccess(BaseModel):
    """Successful login response"""
    token: str
    broadcast_token: Optional[str] = None
    user: User
    redirect_to: str


class LoginResponse(BaseModel):
    """Login response wrapper"""
    success: LoginSuccess


class Deal(BaseModel):
    """Deal model"""
    id: int
    title: str
    created_at: str
    firm: Optional[str] = ""
    asset_class: str
    deal_status: str
    currency: str
    user_id: int
    deal_capital_seeker_email: Optional[str] = ""


class DealsResponse(BaseModel):
    """Deals list response"""
    data: List[Deal]
    message: str


class Folder(BaseModel):
    """Folder model"""
    id: int
    name: str
    parent_id: Optional[int] = None
    deal_id: int


class DealFoldersResponse(BaseModel):
    """Deal folders response"""
    data: List[Folder]
    message: str


class File(BaseModel):
    """File model"""
    id: int
    name: str
    folder_id: Optional[int] = None
    deal_id: int
    size: Optional[int] = None
    mime_type: Optional[str] = None
    created_at: Optional[str] = None


class DealFilesResponse(BaseModel):
    """Deal files response"""
    data: List[File]
    message: str


class ApiError(BaseModel):
    """Error response model"""
    detail: str