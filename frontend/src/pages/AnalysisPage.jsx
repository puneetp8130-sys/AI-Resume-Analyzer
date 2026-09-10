import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnalysisProgress from '../components/resume/AnalysisProgress.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { resumeService } from '../services/resumeService';
import { useToast } from '../hooks/useToast';
import { ROUTES, buildReportPath } from '../constants';

/**
 * Shows a dedicated processing screen while the upload -> extract ->
 * analyze pipeline runs, then redirects to the finished report.
 * The file to analyze is passed via router state from UploadResumePage;
 * if it's missing (e.g. the page was refreshed directly), we show a
 * friendly error instead of crashing.
 */
export default function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const hasStarted = useRef(false);

  const file = location.state?.file;
  const targetRole = location.state?.targetRole || '';

  useEffect(() => {
    if (!file) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    let isCancelled = false;

    async function runPipeline() {
      try {
        setStep(0);
        const uploadResult = await resumeService.upload(file);

        if (isCancelled) return;
        setStep(2);

        const report = await resumeService.analyze({
          fileName: uploadResult.fileName,
          targetRole,
          extractedText: uploadResult.extractedText,
        });

        if (isCancelled) return;
        setStep(3);
        toast.success('Your resume report is ready.');
        navigate(buildReportPath(report.id), { replace: true });
      } catch (err) {
        if (isCancelled) return;
        setError(err.message || 'Resume analysis is temporarily unavailable. Please try again.');
      }
    }

    runPipeline();

    return () => {
      isCancelled = true;
    };
  }, [file, targetRole, navigate, toast]);

  if (!file) {
    return (
      <ErrorState
        title="Nothing to analyze"
        description="We couldn't find a resume to analyze. Please start again from the upload page."
        onRetry={() => navigate(ROUTES.UPLOAD)}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Analysis failed"
        description={error}
        onRetry={() => navigate(ROUTES.UPLOAD)}
      />
    );
  }

  return <AnalysisProgress activeStep={step} />;
}
