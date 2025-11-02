import axios, { AxiosError } from 'axios';
import type { LoginRequest, LoginResponse, DealsResponse, ApiError } from '../types';

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
      timeout: 30000, // 30 seconds
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

  logout() {
    this.clearToken();
  }
}

export const apiService = new ApiService();