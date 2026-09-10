import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import Button from '../common/Button.jsx';
import MobileNav from './MobileNav.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center gap-2 font-bold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">R</span>
          <span className="hidden sm:inline">Resume Analyzer</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to={ROUTES.HISTORY} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                History
              </Link>
              <span className="text-sm text-gray-500">{user?.name}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 md:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileOpen((open) => !open)}
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      </div>

      <MobileNav isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} onLogout={handleLogout} />
    </header>
  );
}
