import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

export default function MobileNav({ isOpen, onClose, onLogout }) {
  const { isAuthenticated, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
      <div className="flex flex-col gap-1">
        {isAuthenticated ? (
          <>
            <span className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-400">
              {user?.name}
            </span>
            <Link to={ROUTES.DASHBOARD} onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Dashboard
            </Link>
            <Link to={ROUTES.UPLOAD} onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Upload Resume
            </Link>
            <Link to={ROUTES.HISTORY} onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              History
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="rounded-lg px-2 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Log in
            </Link>
            <Link to={ROUTES.REGISTER} onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
