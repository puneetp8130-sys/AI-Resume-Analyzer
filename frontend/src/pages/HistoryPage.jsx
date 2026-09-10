import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { useToast } from '../hooks/useToast';
import { buildReportPath, ROUTES } from '../constants';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import { SkeletonCard } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { formatDate } from '../utils/formatDate';

export default function HistoryPage() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('loading');
  const [reportPendingDelete, setReportPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadHistory = () => {
    setStatus('loading');
    resumeService
      .getHistory()
      .then((data) => {
        setReports(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(loadHistory, []);

  const handleConfirmDelete = async () => {
    if (!reportPendingDelete) return;
    setIsDeleting(true);
    try {
      await resumeService.remove(reportPendingDelete.id);
      setReports((current) => current.filter((report) => report.id !== reportPendingDelete.id));
      toast.success('Report deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete this report. Please try again.');
    } finally {
      setIsDeleting(false);
      setReportPendingDelete(null);
    }
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">History</h1>
      <p className="mb-6 text-sm text-gray-500">All of your previous resume analyses.</p>

      {status === 'loading' && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {status === 'error' && <ErrorState description="We couldn't load your history." onRetry={loadHistory} />}

      {status === 'success' && reports.length === 0 && (
        <EmptyState
          title="No reports yet"
          description="Your analyzed resumes will show up here."
          action={
            <Link to={ROUTES.UPLOAD}>
              <Button>Upload resume</Button>
            </Link>
          }
        />
      )}

      {status === 'success' && reports.length > 0 && (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">{report.fileName}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {report.targetRole || 'No target role'} · {formatDate(report.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge color="brand">{report.atsScore}/100</Badge>
                <Link to={buildReportPath(report.id)}>
                  <Button variant="secondary">Open</Button>
                </Link>
                <Button variant="danger" onClick={() => setReportPendingDelete(report)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(reportPendingDelete)}
        title="Delete this report?"
        description={`"${reportPendingDelete?.fileName}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete report"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setReportPendingDelete(null)}
      />
    </div>
  );
}
