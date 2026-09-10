import React from 'react';
import { formatDate } from '../../utils/formatDate';

export default function ReportHeader({ fileName, targetRole, createdAt }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{fileName || 'Resume report'}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {targetRole ? `Target role: ${targetRole}` : 'No target role specified'}
        {createdAt ? ` · Analyzed ${formatDate(createdAt)}` : ''}
      </p>
    </div>
  );
}
