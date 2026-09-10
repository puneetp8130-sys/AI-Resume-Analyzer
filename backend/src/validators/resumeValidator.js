const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const MAX_TARGET_ROLE_LENGTH = 100;

function validateTargetRole(targetRole) {
  if (targetRole === undefined || targetRole === null || targetRole === '') {
    return '';
  }
  if (typeof targetRole !== 'string') {
    throw new AppError('Target role must be text.', 400, 'VALIDATION_ERROR');
  }
  const trimmed = targetRole.trim();
  if (trimmed.length > MAX_TARGET_ROLE_LENGTH) {
    throw new AppError(`Target role must be under ${MAX_TARGET_ROLE_LENGTH} characters.`, 400, 'VALIDATION_ERROR');
  }
  return trimmed;
}

function validateObjectId(id, message = 'Invalid identifier.') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(message, 404, 'REPORT_NOT_FOUND');
  }
  return id;
}

module.exports = { validateTargetRole, validateObjectId };
