const authService = require('../services/authService');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const input = validateRegisterInput(req.body);
  const { user, token } = await authService.register(input);
  return success(res, { user, token }, 'Account created successfully.', 201);
});

const login = asyncHandler(async (req, res) => {
  const input = validateLoginInput(req.body);
  const { user, token } = await authService.login(input);
  return success(res, { user, token }, 'Logged in successfully.');
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.userId);
  return success(res, { user });
});

module.exports = { register, login, getCurrentUser };
