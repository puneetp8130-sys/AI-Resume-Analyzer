import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { resumeService } from '../services/resumeService';
import { ROUTES, buildReportPath } from '../constants';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import { SkeletonCard } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { formatDate } from '../utils/formatDate';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState([]);
  const [status, setStatus] = useState('loading');

  const loadRecent = () => {
    setStatus('loading');
    resumeService
      .getHistory()
      .then((reports) => {
        setRecentReports(reports.slice(0, 3));
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(loadRecent, []);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Upload a resume to get an instant ATS score and improvement plan.</p>
        </div>
        <Link to={ROUTES.UPLOAD}>
          <Button>Upload resume</Button>
        </Link>
      </div>

      <Card className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Ready to check a resume?</h2>
          <p className="mt-1 text-sm text-gray-500">Drop in a PDF and optionally a target role to get started.</p>
        </div>
        <Link to={ROUTES.UPLOAD}>
          <Button variant="secondary">Start analysis</Button>
        </Link>
      </Card>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Recent reports</h2>

      {status === 'loading' && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {status === 'error' && (
        <ErrorState description="We couldn't load your recent reports." onRetry={loadRecent} />
      )}

      {status === 'success' && recentReports.length === 0 && (
        <EmptyState
          title="No reports yet"
          description="Upload your first resume to see your ATS score and feedback here."
          action={
            <Link to={ROUTES.UPLOAD}>
              <Button>Upload resume</Button>
            </Link>
          }
        />
      )}

      {status === 'success' && recentReports.length > 0 && (
        <div className="space-y-3">
          {recentReports.map((report) => (
            <Link key={report.id} to={buildReportPath(report.id)}>
              <Card className="flex items-center justify-between transition-shadow hover:shadow-md">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{report.fileName}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{formatDate(report.createdAt)}</p>
                </div>
                <Badge color="brand">{report.atsScore}/100</Badge>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
