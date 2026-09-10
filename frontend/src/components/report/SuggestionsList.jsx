import React from 'react';
import Card from '../common/Card.jsx';

export default function SuggestionsList({ suggestions = [] }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Suggestions</h2>
      {suggestions.length === 0 ? (
        <p className="text-sm text-gray-400">No suggestions were provided.</p>
      ) : (
        <ol className="space-y-2">
          {suggestions.map((item, index) => (
            <li key={index} className="flex gap-3 text-sm text-gray-700">
              <span className="font-semibold text-brand-600">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
