/**
 * Consistent API response helpers used across all controllers.
 */

function success(res, data = {}, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

function error(res, message = 'Something went wrong', code = 'INTERNAL_ERROR', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}

module.exports = { success, error };
