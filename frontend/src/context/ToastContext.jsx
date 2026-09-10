import React, { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', durationMs = 4000) => {
      const id = ++idCounter;
      setToasts((current) => [...current, { id, message, type }]);
      if (durationMs > 0) {
        setTimeout(() => dismissToast(id), durationMs);
      }
      return id;
    },
    [dismissToast]
  );

  const value = {
    toasts,
    showToast,
    dismissToast,
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info'),
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
