import React from 'react';

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
        R
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
