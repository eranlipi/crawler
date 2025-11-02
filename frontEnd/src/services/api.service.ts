import axios, { AxiosError } from 'axios';
import type { LoginRequest, LoginResponse, DealsResponse , DealFoldersResponse ,DealFilesResponse , ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// External API URLs for direct calls
const EXTERNAL_API_URLS: Record<string, string> = {
  fo1: 'https://fo1.api.altius.finance',
  fo2: 'https://fo2.api.altius.finance',
};

class ApiService {
  private axiosInstance;
  private externalAxiosInstance;
  private token: string | null = null;
  private currentWebsite: string | null = null;
  private externalApiUrl: string | null = null;

  constructor() {
    // Instance for our backend
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      withCredentials: true,
    });

    // Instance for direct external API calls
    this.externalAxiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      withCredentials: true, // Critical for cookie-based auth
    });

    // Add request interceptor to include token in headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  setWebsite(website: string) {
    this.currentWebsite = website;
    this.externalApiUrl = EXTERNAL_API_URLS[website.toLowerCase()];
  }

  clearToken() {
    this.token = null;
    this.currentWebsite = null;
    this.externalApiUrl = null;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      // Call external API directly to set cookies in browser
      const externalApiUrl = EXTERNAL_API_URLS[data.website.toLowerCase()];
      if (!externalApiUrl) {
        throw new Error(`Unsupported website: ${data.website}`);
      }

      const response = await this.externalAxiosInstance.post<LoginResponse>(
        `${externalApiUrl}/api/v0.0.2/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      // Store the token and website for future requests
      if (response.data.success?.token) {
        this.setToken(response.data.success.token);
        this.setWebsite(data.website);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
          axiosError.response?.data?.detail ||
          axiosError.message ||
          'Login failed'
        );
      }
      throw error;
    }
  }

  async getDeals(): Promise<DealsResponse> {
    try {
      if (!this.token || !this.externalApiUrl) {
        throw new Error('No authentication token. Please login first.');
      }

      // Call external API directly with cookies
      const response = await this.externalAxiosInstance.post<DealsResponse>(
        `${this.externalApiUrl}/api/v0.0.2/deals-list`,
        { view: 'task-manage' }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
          axiosError.response?.data?.detail ||
          axiosError.message ||
          'Failed to fetch deals'
        );
      }
      throw error;
    }
  }
// get deal files
 async getDealFiles(dealId: number): Promise<DealFilesResponse> {
    try {
      if (!this.token || !this.externalApiUrl) {
        throw new Error('No authentication token. Please login first.');
      }

      const response = await this.externalAxiosInstance.get<DealFilesResponse>(
        `${this.externalApiUrl}/api/v0.0.3/deals/${dealId}/files`
      );
      
      // Transform object to array if needed
      if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
        const filesArray = Object.values(response.data.data).map((file: any) => ({
          id: file.id,
          name: file.name,
          size: file.size_in_bytes || 0,
          mime_type: file.type || 'unknown',
          url: file.file_url,
          created_at: file.created_at,
        }));
        return { data: filesArray, message: response.data.message };
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        
        if (axiosError.response?.status === 404) {
          return { data: [], message: 'No files found' };
        }
        
        throw new Error(
          axiosError.response?.data?.detail ||
          axiosError.message ||
          'Failed to fetch deal files'
        );
      }
      throw error;
    }
  }

  async getDealFolders(dealId: number): Promise<DealFoldersResponse> {
    try {
      if (!this.token || !this.externalApiUrl) {
        throw new Error('No authentication token. Please login first.');
      }

      const response = await this.externalAxiosInstance.get<DealFoldersResponse>(
        `${this.externalApiUrl}/api/v0.0.3/deals/${dealId}/folders`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
          axiosError.response?.data?.detail ||
          axiosError.message ||
          'Failed to fetch deal folders'
        );
      }
      throw error;
    }
  }

  async downloadFile(dealId: number, fileId: number, filename: string): Promise<void> {
    try {
      if (!this.token || !this.externalApiUrl) {
        throw new Error('No authentication token. Please login first.');
      }

      // Use the correct download endpoint pattern: /api/v0.0.2/deals/{dealId}/files/{fileId}/save
      const response = await this.externalAxiosInstance.get(
        `${this.externalApiUrl}/api/v0.0.2/deals/${dealId}/files/${fileId}/save`,
        {
          responseType: 'blob', // Important for file downloads
        }
      );

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
          axiosError.response?.data?.detail ||
          axiosError.message ||
          'Failed to download file'
        );
      }
      throw error;
    }
  }


  

  logout() {
    this.clearToken();
  }
}

export const apiService = new ApiService();