import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { classNames } from '../../utils/classNames';

const LINKS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: '🏠' },
  { to: ROUTES.UPLOAD, label: 'Upload Resume', icon: '⬆️' },
  { to: ROUTES.HISTORY, label: 'History', icon: '🕘' },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white px-3 py-6 md:block">
      <nav className="flex flex-col gap-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'
              )
            }
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
