import React from 'react';
import { classNames } from '../../utils/classNames';

const SIZE_CLASS = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={classNames(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        SIZE_CLASS[size] || SIZE_CLASS.md,
        className
      )}
    />
  );
}
