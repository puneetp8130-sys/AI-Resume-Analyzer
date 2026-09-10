import React from 'react';
import { classNames } from '../../utils/classNames';
import Spinner from './Spinner.jsx';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classNames(VARIANT_CLASS[variant] || VARIANT_CLASS.primary, className)}
      {...rest}
    >
      {isLoading && <Spinner size="sm" className="text-current" />}
      <span>{children}</span>
    </button>
  );
}
