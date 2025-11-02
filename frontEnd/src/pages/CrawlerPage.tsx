import { useState } from 'react';
import type { Website } from '../types';
import { useCrawler } from '../hooks/useCrawler';
import { WebsiteSelector } from '../components/WebsiteSelector';
import { LoginForm } from '../components/LoginForm';
import { DealsList } from '../components/DealsList';
import { ErrorMessage } from '../components/ErrorMessage';

const WEBSITES: Website[] = [
  {
    id: 'fo1',
    name: 'FO1 Altius Finance',
    defaultEmail: 'fo1_test_user@whatever.com',
    defaultPassword: 'Test123!',
  },
  {
    id: 'fo2',
    name: 'FO2 Altius Finance',
    defaultEmail: 'fo2_test_user@whatever.com',
    defaultPassword: 'Test223!',
  },
];

export const CrawlerPage = () => {
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const {
    login,
    fetchDeals,
    logout,
    reset,
    isAuthenticated,
    user,
    deals,
    loading,
    loadingDeals,
    error,
  } = useCrawler();

  const selectedWebsiteData = WEBSITES.find((w) => w.id === selectedWebsite);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(selectedWebsite, email, password);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleWebsiteChange = (websiteId: string) => {
    setSelectedWebsite(websiteId);
    logout(); // Clear previous data and logout
  };

  const handleLogout = () => {
    logout();
    setSelectedWebsite('');
  };

  return (
    <div className="crawler-page">
      {!isAuthenticated ? (
        <>
          <div className="login-container">
            <h1>Deals Portal</h1>
            <p className="subtitle">Select a website and login to view deals</p>

            <WebsiteSelector
              websites={WEBSITES}
              selectedWebsite={selectedWebsite}
              onSelect={handleWebsiteChange}
            />

            {selectedWebsite && (
              <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                defaultEmail={selectedWebsiteData?.defaultEmail}
                defaultPassword={selectedWebsiteData?.defaultPassword}
              />
            )}

            {error && <ErrorMessage message={error} onClose={reset} />}
          </div>
        </>
      ) : (
        <>
          {error && <ErrorMessage message={error} onClose={reset} />}

          {user && (
            <DealsList
              deals={deals}
              user={user}
              loading={loadingDeals}
              onRefresh={fetchDeals}
              onLogout={handleLogout}
            />
          )}
        </>
      )}
    </div>
  );
};