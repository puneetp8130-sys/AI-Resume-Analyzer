import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { ROUTES } from '../constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to={ROUTES.HOME} className="mt-6">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
