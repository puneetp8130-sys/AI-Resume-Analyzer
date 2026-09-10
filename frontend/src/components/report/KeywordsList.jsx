import React from 'react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

export default function KeywordsList({ keywords = [] }) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Relevant Keywords</h2>
      {keywords.length === 0 ? (
        <p className="text-sm text-gray-400">No keywords were identified.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <Badge key={keyword} color="gray">
              {keyword}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
