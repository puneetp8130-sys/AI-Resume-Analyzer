import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader.jsx';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ROUTES } from '../constants';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (details) => {
    setIsLoading(true);
    setFormError(null);
    try {
      await register(details);
      toast.success('Account created! Let\'s analyze your first resume.');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Unable to create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="w-full">
        <AuthHeader title="Create your account" subtitle="Start getting instant ATS feedback on your resume" />
        <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} formError={formError} />
      </div>
    </div>
  );
}
