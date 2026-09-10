import React, { useState } from 'react';
import FileDropzone from './FileDropzone.jsx';
import ResumeFilePreview from './ResumeFilePreview.jsx';
import TargetRoleInput from './TargetRoleInput.jsx';
import Button from '../common/Button.jsx';

/**
 * Presentational upload form. It never calls resumeService itself — the
 * parent page owns the upload/analyze orchestration and passes callbacks
 * and loading state down as props.
 */
export default function ResumeUpload({ onAnalyze, isSubmitting }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [targetRole, setTargetRole] = useState('');

  const handleFileSelected = (selectedFile, error) => {
    setFile(selectedFile);
    setFileError(error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      setFileError('Please select a PDF resume to upload.');
      return;
    }
    onAnalyze({ file, targetRole });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {file ? (
        <ResumeFilePreview file={file} onRemove={() => setFile(null)} />
      ) : (
        <FileDropzone onFileSelected={handleFileSelected} error={fileError} />
      )}

      <TargetRoleInput value={targetRole} onChange={setTargetRole} />

      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
        Analyze resume
      </Button>
    </form>
  );
}
