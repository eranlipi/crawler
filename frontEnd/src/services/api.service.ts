import axios, { AxiosError } from 'axios';
import type { LoginRequest, LoginResponse, DealsResponse , DealFoldersResponse ,DealFilesResponse , ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  private axiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, 
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

  clearToken() {
    this.token = null;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.axiosInstance.post<LoginResponse>('/login', data);

      // Store the token for future requests
      if (response.data.success?.token) {
        this.setToken(response.data.success.token);
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
      if (!this.token) {
        throw new Error('No authentication token. Please login first.');
      }

      const response = await this.axiosInstance.post<DealsResponse>('/deals-list');
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
      if (!this.token) {
        throw new Error('No authentication token. Please login first.');
      }

      const response = await this.axiosInstance.get<DealFilesResponse>(
        `/deals/${dealId}/files`
      );
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
      if (!this.token) {
        throw new Error('No authentication token. Please login first.');
      }

      const response = await this.axiosInstance.get<DealFoldersResponse>(
        `/deals/${dealId}/folders`
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

  async downloadFile(fileUrl: string, filename: string): Promise<void> {
    try {
      if (!this.token) {
        throw new Error('No authentication token. Please login first.');
      }

      const response = await this.axiosInstance.get('/download-file', {
        params: { 
          file_url: fileUrl,
          filename: filename
        },
        responseType: 'blob', // Important for file downloads
      });

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