import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { Deal, User,DealFile } from '../types';

interface CrawlerState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  deals: Deal[];
  loading: boolean;
  error: string | null;
  loadingDeals: boolean;
  selectedDeal: Deal | null;
  dealFiles: DealFile[];
  loadingFiles: boolean;
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
    selectedDeal: null,
    dealFiles: [],
    loadingFiles: false,
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

  const selectDeal = (deal: Deal) => {
    setState((prev) => ({
      ...prev,
      selectedDeal: deal,
      dealFiles: [], // Reset files when selecting new deal
    }));
  };

  const fetchDealFiles = async (dealId: number) => {
    setState((prev) => ({ ...prev, loadingFiles: true, error: null }));

    try {
      const response = await apiService.getDealFiles(dealId);

      setState((prev) => ({
        ...prev,
        dealFiles: response.data,
        loadingFiles: false,
      }));

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch files';
      setState((prev) => ({
        ...prev,
        loadingFiles: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  const downloadFile = async (dealId: number, fileId: number, filename: string) => {
    try {
      await apiService.downloadFile(dealId, fileId, filename);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file';
      setState((prev) => ({
        ...prev,
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
      selectedDeal: null,
      dealFiles: [],
      loadingFiles: false,
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
    selectDeal,
    fetchDealFiles,
    downloadFile,
    logout,
    reset,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token,
    deals: state.deals,
    loading: state.loading,
    loadingDeals: state.loadingDeals,
    error: state.error,
    selectedDeal: state.selectedDeal,
    dealFiles: state.dealFiles,
    loadingFiles: state.loadingFiles,
  };
};