const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

/**
 * Verifies the Authorization: Bearer <JWT> header and attaches
 * req.user = { userId } for downstream controllers/services.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId };
    return next();
  } catch (err) {
    return next(new AppError('Invalid or expired session. Please log in again.', 401, 'INVALID_TOKEN'));
  }
}

module.exports = { requireAuth };
