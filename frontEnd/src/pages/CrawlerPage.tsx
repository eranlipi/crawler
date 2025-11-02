import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { DealsList } from '../components/DealsList';
import { DealFilesModal } from '../components/DealFilesModal';
import { ErrorMessage } from '../components/ErrorMessage';
import { useCrawler } from '../hooks/useCrawler';
import type { Deal } from '../types';

export const CrawlerPage: React.FC = () => {
  const {
    login,
    fetchDeals,
    selectDeal,
    fetchDealFiles,
    downloadFile,
    logout,
    reset,
    isAuthenticated,
    user,
    deals,
    loading,
    loadingDeals,
    error,
    selectedDeal,
    dealFiles,
    loadingFiles,
  } = useCrawler();

  const [showFilesModal, setShowFilesModal] = useState(false);

  const handleLogin = async (website: string, email: string, password: string) => {
    await login(website, email, password);
  };

  const handleViewFiles = async (deal: Deal) => {
    selectDeal(deal);
    setShowFilesModal(true);
    await fetchDealFiles(deal.id);
  };

  const handleCloseModal = () => {
    setShowFilesModal(false);
  };

  const handleDownload = async (fileUrl: string, filename: string) => {
    try {
      await downloadFile(fileUrl, filename);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleRefresh = async () => {
    await fetchDeals();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-5">
          <LoginForm onLogin={handleLogin} loading={loading} />
          {error && <ErrorMessage message={error} onDismiss={reset} />}
        </div>
      ) : (
        <div className="max-w-[87.5rem] mx-auto py-10 px-5">
          <div className="flex justify-between items-center mb-7 bg-white p-6 rounded-xl shadow-md">
            <div>
              <h2 className="m-0 mb-2 text-gray-800 text-2xl">Welcome, {user?.full_name || user?.email}!</h2>
              <p className="m-0 text-gray-500 text-sm">
                {user?.role.presentation_name} at {user?.account.name}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleRefresh} 
                className="py-2.5 px-5 border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 text-sm bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loadingDeals}
              >
                {loadingDeals ? '⏳' : '🔄'} Refresh
              </button>
              <button 
                onClick={logout} 
                className="py-2.5 px-5 border-none rounded-lg font-semibold cursor-pointer transition-all duration-200 text-sm bg-red-500 text-white hover:bg-red-600 hover:scale-105"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {error && <ErrorMessage message={error} onDismiss={reset} />}

          <div className="bg-white py-4 px-6 rounded-xl shadow-sm mb-5">
            <h3 className="m-0 text-gray-800 text-xl">Deals ({deals.length})</h3>
          </div>

          {loadingDeals ? (
            <div className="flex flex-col items-center justify-center py-20 px-5 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#667eea] rounded-full animate-spin mb-5"></div>
              <p className="text-gray-500 text-lg">Loading deals...</p>
            </div>
          ) : (
            <DealsList deals={deals} onViewFiles={handleViewFiles} />
          )}
        </div>
      )}

      {showFilesModal && selectedDeal && (
        <DealFilesModal
          deal={selectedDeal}
          files={dealFiles}
          loading={loadingFiles}
          onClose={handleCloseModal}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};
