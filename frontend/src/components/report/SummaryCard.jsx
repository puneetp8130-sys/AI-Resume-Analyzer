import React from 'react';
import Card from '../common/Card.jsx';

export default function SummaryCard({ summary }) {
  if (!summary) return null;
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Summary</h2>
      <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
    </Card>
  );
}
