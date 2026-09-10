import React from 'react';
import Spinner from '../common/Spinner.jsx';

const STEPS = ['Uploading resume', 'Extracting text', 'Running AI analysis', 'Preparing your report'];

export default function AnalysisProgress({ activeStep = 2 }) {
  return (
    <div className="card mx-auto max-w-md text-center">
      <Spinner size="lg" className="mx-auto mb-6 text-brand-600" />
      <h2 className="text-lg font-semibold text-gray-900">Analyzing your resume…</h2>
      <p className="mt-1 text-sm text-gray-500">This usually takes a few seconds.</p>

      <ul className="mt-6 space-y-3 text-left">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-sm">
            <span
              className={
                index <= activeStep
                  ? 'flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white'
                  : 'flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-400'
              }
            >
              {index < activeStep ? '✓' : index + 1}
            </span>
            <span className={index <= activeStep ? 'text-gray-800' : 'text-gray-400'}>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
