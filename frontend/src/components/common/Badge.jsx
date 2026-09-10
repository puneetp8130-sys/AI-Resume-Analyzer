import React from 'react';
import { classNames } from '../../utils/classNames';

const COLOR_CLASS = {
  gray: 'bg-gray-100 text-gray-700',
  brand: 'bg-brand-50 text-brand-700',
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-800',
  red: 'bg-red-50 text-red-700',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return <span className={classNames('badge', COLOR_CLASS[color] || COLOR_CLASS.gray, className)}>{children}</span>;
}
