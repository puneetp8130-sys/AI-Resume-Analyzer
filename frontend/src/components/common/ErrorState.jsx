import React from 'react';
import Button from './Button.jsx';

export default function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 px-6 py-14 text-center">
      <div className="mb-3 text-4xl" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="text-base font-semibold text-red-800">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-red-700">{description}</p>}
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
