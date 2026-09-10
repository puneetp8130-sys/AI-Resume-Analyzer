const AppError = require('../utils/AppError');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function validateRegisterInput(body) {
  const { name, email, password } = body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (errors.length > 0) {
    throw new AppError(errors.join(' '), 400, 'VALIDATION_ERROR');
  }

  return { name: name.trim(), email: email.trim().toLowerCase(), password };
}

function validateLoginInput(body) {
  const { email, password } = body || {};
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }
  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    throw new AppError(errors.join(' '), 400, 'VALIDATION_ERROR');
  }

  return { email: email.trim().toLowerCase(), password };
}

module.exports = { validateRegisterInput, validateLoginInput };
