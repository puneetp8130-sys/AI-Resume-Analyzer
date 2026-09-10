import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { useToast } from '../hooks/useToast';
import { ROUTES } from '../constants';
import ReportHeader from '../components/report/ReportHeader.jsx';
import ScoreCard from '../components/report/ScoreCard.jsx';
import SummaryCard from '../components/report/SummaryCard.jsx';
import StrengthsCard from '../components/report/StrengthsCard.jsx';
import WeaknessesCard from '../components/report/WeaknessesCard.jsx';
import SkillsList from '../components/report/SkillsList.jsx';
import MissingSkillsList from '../components/report/MissingSkillsList.jsx';
import KeywordsList from '../components/report/KeywordsList.jsx';
import SectionFeedback from '../components/report/SectionFeedback.jsx';
import SuggestionsList from '../components/report/SuggestionsList.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Button from '../components/common/Button.jsx';
import Skeleton, { SkeletonText } from '../components/common/Skeleton.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadReport = () => {
    setStatus('loading');
    resumeService
      .getById(id)
      .then((data) => {
        setReport(data);
        setStatus('success');
      })
      .catch((err) => {
        setStatus(err.code === 'REPORT_NOT_FOUND' ? 'not-found' : 'error');
      });
  };

  useEffect(loadReport, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await resumeService.remove(id);
      toast.success('Report deleted.');
      navigate(ROUTES.HISTORY, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to delete this report.');
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <div className="card">
          <SkeletonText lines={4} />
        </div>
        <div className="card">
          <SkeletonText lines={3} />
        </div>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <ErrorState
        title="Report not found"
        description="This report could not be found."
        onRetry={() => navigate(ROUTES.HISTORY)}
      />
    );
  }

  if (status === 'error') {
    return <ErrorState description="We couldn't load this report." onRetry={loadReport} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <ReportHeader fileName={report.fileName} targetRole={report.targetRole} createdAt={report.createdAt} />
        <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
          Delete
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
        <ScoreCard score={report.atsScore} />
        <div className="space-y-6">
          <SummaryCard summary={report.summary} />
          <div className="grid gap-6 sm:grid-cols-2">
            <StrengthsCard strengths={report.strengths} />
            <WeaknessesCard weaknesses={report.weaknesses} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <SkillsList skills={report.skills} />
        <MissingSkillsList missingSkills={report.missingSkills} />
      </div>

      <div className="mt-6">
        <KeywordsList keywords={report.keywords} />
      </div>

      <div className="mt-6">
        <SectionFeedback sectionFeedback={report.sectionFeedback} />
      </div>

      <div className="mt-6">
        <SuggestionsList suggestions={report.suggestions} />
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete this report?"
        description="This report will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete report"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
