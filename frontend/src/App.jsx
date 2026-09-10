import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { ToastContainer } from './components/common/Toast.jsx';
import { useToast } from './hooks/useToast';

export default function App() {
  const { toasts, dismissToast } = useToast();

  return (
    <>
      <AppRoutes />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
