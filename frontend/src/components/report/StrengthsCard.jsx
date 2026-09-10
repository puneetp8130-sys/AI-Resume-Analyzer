import React from 'react';
import Card from '../common/Card.jsx';

export default function StrengthsCard({ strengths = [] }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Strengths</h2>
      {strengths.length === 0 ? (
        <p className="text-sm text-gray-400">No specific strengths were identified.</p>
      ) : (
        <ul className="space-y-2">
          {strengths.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm text-gray-700">
              <span className="text-green-600" aria-hidden="true">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
