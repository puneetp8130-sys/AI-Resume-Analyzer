import React from 'react';
import Card from '../common/Card.jsx';
import { getAtsScoreBand } from '../../constants';

const RING_COLOR = {
  green: '#16a34a',
  brand: '#3f66f1',
  yellow: '#ca8a04',
  red: '#dc2626',
};

export default function ScoreCard({ score = 0 }) {
  const band = getAtsScoreBand(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <Card className="flex flex-col items-center text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">ATS Score</p>
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={RING_COLOR[band.color] || RING_COLOR.brand}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-700">{band.label}</p>
    </Card>
  );
}
