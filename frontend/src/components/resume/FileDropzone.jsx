import React, { useCallback, useState } from 'react';
import { classNames } from '../../utils/classNames';
import { isPdfFile, isWithinSizeLimit } from '../../utils/validators';
import { MAX_RESUME_SIZE_MB } from '../../constants';

export default function FileDropzone({ onFileSelected, error }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const validateAndEmit = useCallback(
    (file) => {
      if (!file) return;
      if (!isPdfFile(file)) {
        onFileSelected(null, 'Please upload a valid PDF resume.');
        return;
      }
      if (!isWithinSizeLimit(file, MAX_RESUME_SIZE_MB)) {
        onFileSelected(null, `File is too large. Max size is ${MAX_RESUME_SIZE_MB}MB.`);
        return;
      }
      onFileSelected(file, null);
    },
    [onFileSelected]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    validateAndEmit(event.dataTransfer.files?.[0]);
  };

  const handleChange = (event) => {
    validateAndEmit(event.target.files?.[0]);
  };

  return (
    <div>
      <label
        htmlFor="resume-file-input"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={classNames(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
          isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 bg-white hover:bg-gray-50',
          error ? 'border-red-400' : ''
        )}
      >
        <div className="mb-3 text-4xl" aria-hidden="true">
          📄
        </div>
        <p className="text-sm font-medium text-gray-700">
          <span className="text-brand-600">Click to upload</span> or drag and drop
        </p>
        <p className="mt-1 text-xs text-gray-400">PDF only, up to {MAX_RESUME_SIZE_MB}MB</p>
        <input
          id="resume-file-input"
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={handleChange}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
