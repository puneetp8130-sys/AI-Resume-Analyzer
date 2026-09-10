import React from 'react';
import { classNames } from '../../utils/classNames';

export default function Skeleton({ className = '' }) {
  return <div className={classNames('animate-pulse rounded-md bg-gray-200', className)} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={classNames('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={classNames('h-3', index === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card">
      <Skeleton className="mb-4 h-5 w-1/3" />
      <SkeletonText lines={3} />
    </div>
  );
}
