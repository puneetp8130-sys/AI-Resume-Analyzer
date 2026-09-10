import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { ROUTES } from '../../constants';
import { isValidEmail, isValidPassword } from '../../utils/validators';

export default function RegisterForm({ onSubmit, isLoading, formError }) {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.name || values.name.trim().length < 2) errors.name = 'Enter your full name.';
    if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
    if (!isValidPassword(values.password)) errors.password = 'Password must be at least 8 characters.';
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
        id="name"
        label="Full name"
        autoComplete="name"
        value={values.name}
        onChange={handleChange('name')}
        error={fieldErrors.name}
        placeholder="Jordan Lee"
      />
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
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange('password')}
        error={fieldErrors.password}
        placeholder="At least 8 characters"
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Create account
      </Button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </form>
  );
}
