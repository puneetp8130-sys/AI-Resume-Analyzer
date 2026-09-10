import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ROUTES } from '../constants';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (credentials) => {
    setIsLoading(true);
    setFormError(null);
    try {
      await login(credentials);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="w-full">
        <AuthHeader title="Welcome back" subtitle="Log in to view your resume reports" />
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} formError={formError} />
      </div>
    </div>
  );
}
