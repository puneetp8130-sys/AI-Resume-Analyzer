import React from 'react';

export default function ResumeFilePreview({ file, onRemove }) {
  if (!file) return null;

  const sizeKb = Math.max(1, Math.round(file.size / 1024));

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">
          📄
        </span>
        <div>
          <p className="text-sm font-medium text-gray-800">{file.name}</p>
          <p className="text-xs text-gray-500">{sizeKb} KB</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-sm font-medium text-gray-500 hover:text-red-600"
        aria-label="Remove selected file"
      >
        Remove
      </button>
    </div>
  );
}
