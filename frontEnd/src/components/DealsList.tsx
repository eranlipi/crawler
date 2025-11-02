import React from 'react';
import type { Deal } from '../types';

interface DealsListProps {
  deals: Deal[];
  onViewFiles: (deal: Deal) => void;
}

export const DealsList: React.FC<DealsListProps> = ({ deals, onViewFiles }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      New: 'bg-blue-500',
      'In Progress': 'bg-amber-500',
      Completed: 'bg-green-500',
      Closed: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (deals.length === 0) {
    return (
      <div className="flex justify-center items-center text-center py-15 px-5 text-gray-500 text-lg w-full">
        <p>No deals found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-5 py-5">
      {deals.map((deal) => (
        <div
          key={deal.id}
          className="bg-white border border-gray-200 rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:border-gray-300 flex-1 min-w-[18.75rem] flex flex-col basis-[calc(33.333%-1.25rem)]"
        >
          <div className="flex justify-between items-start mb-4 gap-3">
            <h3 className="text-lg font-semibold text-gray-800 m-0 leading-snug flex-1">
              {deal.title}
            </h3>
            <span
              className={`${getStatusColor(deal.deal_status)} px-3 py-1 rounded-xl text-xs font-semibold text-white whitespace-nowrap flex-shrink-0`}
            >
              {deal.deal_status}
            </span>
          </div>

          <div className="flex flex-col gap-2 mb-4 flex-1">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-gray-500 font-medium">Asset Class:</span>
              <span className="text-sm text-gray-800 font-medium text-right">{deal.asset_class}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-gray-500 font-medium">Currency:</span>
              <span className="text-sm text-gray-800 font-medium text-right">{deal.currency}</span>
            </div>
            {deal.firm && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-sm text-gray-500 font-medium">Firm:</span>
                <span className="text-sm text-gray-800 font-medium text-right">{deal.firm}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-gray-500 font-medium">Created:</span>
              <span className="text-sm text-gray-800 font-medium text-right">{formatDate(deal.created_at)}</span>
            </div>
          </div>

          <button
            className="w-full py-2.5 px-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_0.25rem_0.75rem_rgba(102,126,234,0.4)] active:scale-[0.98]"
            onClick={() => onViewFiles(deal)}
          >
            📁 View Files
          </button>
        </div>
      ))}
    </div>
  );
};
