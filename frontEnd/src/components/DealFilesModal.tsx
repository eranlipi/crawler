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
    const type = mimeType.toLowerCase();
    if (type.includes('pdf')) return '📄';
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg')) return '🖼️';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('video') || type.includes('mp4')) return '🎥';
    return '📎';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] animate-[fadeIn_0.2s_ease-in] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_1.25rem_3.75rem_rgba(0,0,0,0.4)] animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="py-6 px-8 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-t-2xl">
          <div className="flex-1">
            <h2 className="m-0 text-2xl font-bold text-white mb-1">
              Deal Files
            </h2>
            <p className="m-0 text-white/90 text-sm">
              {deal.title}
            </p>
          </div>
          <button
            className="bg-white/20 hover:bg-white/30 border-none text-white text-2xl cursor-pointer p-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all backdrop-blur-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="py-6 px-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#667eea] rounded-full animate-spin mb-5"></div>
              <p className="text-lg">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20 px-5 text-gray-400">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-xl font-medium text-gray-600 mb-2">No files found</p>
              <p className="text-sm text-gray-500">This deal doesn't have any files yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-start gap-4 py-5 px-5 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl transition-all hover:shadow-lg hover:border-[#667eea]/30 hover:-translate-y-0.5 group"
                >
                  {/* File Icon */}
                  <div className="text-5xl flex-shrink-0 transition-transform group-hover:scale-110">
                    {getFileIcon(file.mime_type)}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-lg mb-1 overflow-hidden text-ellipsis">
                      {file.name}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Size:</span>
                        <span className="text-gray-700">{formatFileSize(file.size)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Type:</span>
                        <span className="text-gray-700 uppercase">{file.mime_type}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Created:</span>
                        <span className="text-gray-700">{formatDate(file.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Download Button */}
                  <button
                    className="py-3 px-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all flex-shrink-0 hover:shadow-lg hover:shadow-[#667eea]/50 hover:scale-105 active:scale-95 flex items-center gap-2"
                    onClick={() => onDownload(file.url, file.name)}
                  >
                    <span className="text-lg">⬇️</span>
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && files.length > 0 && (
          <div className="py-4 px-8 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="text-sm text-gray-600 text-center">
              <span className="font-semibold text-gray-800">{files.length}</span> file{files.length !== 1 ? 's' : ''} in this deal
            </div>
          </div>
        )}
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
