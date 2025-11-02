export interface Website {
  id: string;
  name: string;
  defaultEmail: string;
  defaultPassword: string;
}

export interface LoginRequest {
  website: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: {
    id: number;
    name: string;
    presentation_name: string;
  };
  account: {
    id: number;
    name: string;
    domain: string;
  };
}

export interface Deal {
  id: number;
  title: string;
  created_at: string;
  firm: string;
  asset_class: string;
  deal_status: string;
  currency: string;
  user_id: number;
  deal_capital_seeker_email: string;
}

export interface DealFile {
  id: number;
  name: string;
  size: number;
  mime_type: string;
  url: string;
  created_at: string;
  folder_id?: number;
}

export interface DealFolder {
  id: number;
  name: string;
  parent_id?: number;
  files_count: number;
}

export interface LoginResponse {
  success: {
    token: string;
    broadcast_token: string;
    user: User;
    redirect_to: string;
  };
}

export interface DealsResponse {
  data: Deal[];
  message: string;
}

export interface DealFilesResponse {
  data: DealFile[];
  message: string;
}

export interface DealFoldersResponse {
  data: DealFolder[];
  message: string;
}

export interface ApiError {
  detail: string;
}