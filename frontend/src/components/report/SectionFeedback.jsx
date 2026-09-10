import React from 'react';
import Card from '../common/Card.jsx';

export default function SectionFeedback({ sectionFeedback = [] }) {
  if (sectionFeedback.length === 0) return null;
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Section Feedback</h2>
      <div className="space-y-4">
        {sectionFeedback.map((item, index) => (
          <div key={index} className="border-l-2 border-brand-200 pl-4">
            <p className="text-sm font-semibold text-gray-800">{item.section}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.feedback}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
