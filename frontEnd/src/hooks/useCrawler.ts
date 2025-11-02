import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { LoginResponse, DealsResponse, Deal, User } from '../types';

interface CrawlerState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  deals: Deal[];
  loading: boolean;
  error: string | null;
  loadingDeals: boolean;
}

export const useCrawler = () => {
  const [state, setState] = useState<CrawlerState>({
    isAuthenticated: false,
    user: null,
    token: null,
    deals: [],
    loading: false,
    error: null,
    loadingDeals: false,
  });

  const login = async (website: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiService.login({ website, email, password });

      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: response.success.user,
        token: response.success.token,
        loading: false,
      }));

      // Automatically fetch deals after successful login
      await fetchDeals();

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  const fetchDeals = async () => {
    setState((prev) => ({ ...prev, loadingDeals: true, error: null }));

    try {
      const response = await apiService.getDeals();

      setState((prev) => ({
        ...prev,
        deals: response.data,
        loadingDeals: false,
      }));

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deals';
      setState((prev) => ({
        ...prev,
        loadingDeals: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  const logout = () => {
    apiService.logout();
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      deals: [],
      loading: false,
      error: null,
      loadingDeals: false,
    });
  };

  const reset = () => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  return {
    login,
    fetchDeals,
    logout,
    reset,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token,
    deals: state.deals,
    loading: state.loading,
    loadingDeals: state.loadingDeals,
    error: state.error,
  };
};