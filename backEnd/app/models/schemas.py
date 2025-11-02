from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class LoginRequest(BaseModel):
    website: str  # "fo1" or "fo2"
    email: str
    password: str

class UserRole(BaseModel):
    id: int
    name: str
    presentation_name: str

class UserAccount(BaseModel):
    id: int
    name: str
    domain: str

class User(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: UserRole
    account: UserAccount

class LoginSuccess(BaseModel):
    token: str
    broadcast_token: str
    user: User
    redirect_to: str

class LoginResponse(BaseModel):
    success: LoginSuccess

class Deal(BaseModel):
    id: int
    title: str
    created_at: str
    firm: str
    asset_class: str
    deal_status: str
    currency: str
    user_id: int
    deal_capital_seeker_email: str

class DealsResponse(BaseModel):
    data: List[Deal]
    message: str