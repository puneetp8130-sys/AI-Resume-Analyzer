import React from 'react';
import { classNames } from '../../utils/classNames';

export default function Input({ label, id, error, className = '', ...rest }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={classNames('input', error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : '', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
