const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

/**
 * Registers a new user. Throws AppError('EMAIL_IN_USE') if the email is
 * already registered.
 */
async function register({ name, email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_IN_USE');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash });

  const token = signToken({ userId: user._id.toString() });
  return { user: user.toSafeObject(), token };
}

/**
 * Authenticates a user by email/password. Throws AppError('INVALID_CREDENTIALS')
 * on any mismatch, without revealing which field was wrong.
 */
async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({ userId: user._id.toString() });
  return { user: user.toSafeObject(), token };
}

async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
  }
  return user.toSafeObject();
}

module.exports = { register, login, getUserById };
