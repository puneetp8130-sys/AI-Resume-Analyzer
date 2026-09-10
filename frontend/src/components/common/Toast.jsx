import React from 'react';
import { classNames } from '../../utils/classNames';

const TYPE_CLASS = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-900',
};

export default function Toast({ message, type = 'info', onDismiss }) {
  return (
    <div
      role="alert"
      className={classNames(
        'flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg',
        TYPE_CLASS[type] || TYPE_CLASS.info
      )}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}
