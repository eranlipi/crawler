import React, { useEffect } from 'react';
import type { DealFile, Deal } from '../types';

interface DealFilesModalProps {
  deal: Deal;
  files: DealFile[];
  loading: boolean;
  onClose: () => void;
  onDownload: (fileUrl: string, filename: string) => void;
}

export const DealFilesModal: React.FC<DealFilesModalProps> = ({
  deal,
  files,
  loading,
  onClose,
  onDownload,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📎';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-[fadeIn_0.2s_ease-in]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-[90%] max-w-[37.5rem] max-h-[80vh] flex flex-col shadow-[0_0.625rem_2.5rem_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-5 px-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="m-0 text-xl font-semibold text-gray-800">
            Files in "{deal.title}"
          </h2>
          <button
            className="bg-transparent border-none text-2xl text-gray-500 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="py-5 px-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p>Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-15 px-5 text-gray-500 text-lg">
              <p>📂 No files found in this deal</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 py-4 px-4 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-px"
                >
                  <div className="text-3xl flex-shrink-0">
                    {getFileIcon(file.mime_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="py-2 px-4 bg-blue-500 text-white border-none rounded-md text-sm font-medium cursor-pointer transition-all flex-shrink-0 hover:bg-blue-600 hover:scale-105 active:scale-95"
                    onClick={() => onDownload(file.url, file.name)}
                  >
                    ⬇️ Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            transform: translateY(1.25rem);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
