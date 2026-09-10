import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { ROUTES } from '../../constants';
import { isValidEmail } from '../../utils/validators';

export default function LoginForm({ onSubmit, isLoading, formError }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
    if (!values.password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {formError && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}
      <Input
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange('email')}
        error={fieldErrors.email}
        placeholder="you@example.com"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange('password')}
        error={fieldErrors.password}
        placeholder="••••••••"
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Log in
      </Button>
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-600 hover:text-brand-700">
          Create one
        </Link>
      </p>
    </form>
  );
}
