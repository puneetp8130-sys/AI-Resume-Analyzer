import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/resume/ResumeUpload.jsx';
import Card from '../components/common/Card.jsx';

export default function UploadResumePage() {
  const navigate = useNavigate();

  const handleAnalyze = ({ file, targetRole }) => {
    // The actual upload + AI analysis happens on the AnalysisPage so the
    // user sees a dedicated processing screen while it runs.
    navigate('/analysis/pending', { state: { file, targetRole } });
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Upload your resume</h1>
      <p className="mt-1 text-sm text-gray-500">
        We only support text-based PDF resumes right now. Scanned/image-only PDFs aren&apos;t supported yet.
      </p>

      <Card className="mt-6">
        <ResumeUpload onAnalyze={handleAnalyze} isSubmitting={false} />
      </Card>
    </div>
  );
}
