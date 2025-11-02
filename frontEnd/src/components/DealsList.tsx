import type { Deal, User } from '../types';

interface Props {
  deals: Deal[];
  user: User;
  loading?: boolean;
  onRefresh?: () => void;
  onLogout?: () => void;
}

export const DealsList = ({ deals, user, loading = false, onRefresh, onLogout }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="deals-container">
      {/* Header with user info and actions */}
      <div className="deals-header">
        <div className="user-info">
          <h2>Welcome, {user.full_name}</h2>
          <p className="user-details">
            {user.role.presentation_name} at {user.account.name}
          </p>
        </div>
        <div className="header-actions">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="btn-refresh"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Deals'}
            </button>
          )}
          {onLogout && (
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Deals count */}
      <div className="deals-count">
        <h3>Deals ({deals.length})</h3>
      </div>

      {/* Scrollable deals list */}
      <div className="deals-scroll-container">
        {loading && deals.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="empty-state">
            <p>No deals found.</p>
            {onRefresh && (
              <button onClick={onRefresh} className="btn-primary">
                Try Again
              </button>
            )}
          </div>
        ) : (
          <div className="deals-grid">
            {deals.map((deal) => (
              <div key={deal.id} className="deal-card">
                <div className="deal-card-header">
                  <h4 className="deal-title">{deal.title}</h4>
                  <span className={`deal-status status-${deal.deal_status.toLowerCase().replace(' ', '-')}`}>
                    {deal.deal_status}
                  </span>
                </div>

                <div className="deal-card-body">
                  <div className="deal-info-row">
                    <span className="info-label">Asset Class:</span>
                    <span className="info-value">{deal.asset_class}</span>
                  </div>

                  <div className="deal-info-row">
                    <span className="info-label">Currency:</span>
                    <span className="info-value">{deal.currency}</span>
                  </div>

                  {deal.firm && (
                    <div className="deal-info-row">
                      <span className="info-label">Firm:</span>
                      <span className="info-value">{deal.firm}</span>
                    </div>
                  )}

                  <div className="deal-info-row">
                    <span className="info-label">Created:</span>
                    <span className="info-value">{formatDate(deal.created_at)}</span>
                  </div>
                </div>

                <div className="deal-card-footer">
                  <span className="deal-id">ID: {deal.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};