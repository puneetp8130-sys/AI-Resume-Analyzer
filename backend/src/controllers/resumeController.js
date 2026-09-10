const analysisService = require('../services/analysisService');
const { validateTargetRole, validateObjectId } = require('../validators/resumeValidator');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Controllers stay thin: they read the request, delegate to services,
 * and shape the HTTP response. No PDF parsing or AI calls happen here.
 */

const uploadResume = asyncHandler(async (req, res) => {
  const extractedText = await analysisService.extractResumeText(req.file);

  return success(
    res,
    {
      fileName: req.file.originalname,
      extractedText,
    },
    'Resume uploaded and processed successfully.'
  );
});

const analyzeResume = asyncHandler(async (req, res) => {
  const { fileName, extractedText } = req.body || {};
  const targetRole = validateTargetRole(req.body?.targetRole);

  if (!fileName || typeof fileName !== 'string') {
    throw new AppError('A file name is required to analyze a resume.', 400, 'VALIDATION_ERROR');
  }
  if (!extractedText || typeof extractedText !== 'string' || extractedText.trim().length < 40) {
    throw new AppError('No readable resume text was provided for analysis.', 400, 'PDF_NOT_READABLE');
  }

  const report = await analysisService.analyzeAndSave({
    userId: req.user.userId,
    fileName,
    targetRole,
    resumeText: extractedText,
  });

  return success(res, { report }, 'Resume analyzed successfully.', 201);
});

const getHistory = asyncHandler(async (req, res) => {
  const reports = await analysisService.getHistoryForUser(req.user.userId);
  return success(res, { reports });
});

const getReportById = asyncHandler(async (req, res) => {
  const id = validateObjectId(req.params.id, 'This report could not be found.');
  const report = await analysisService.getOwnedAnalysisById(req.user.userId, id);
  return success(res, { report });
});

const deleteReportById = asyncHandler(async (req, res) => {
  const id = validateObjectId(req.params.id, 'This report could not be found.');
  await analysisService.deleteOwnedAnalysisById(req.user.userId, id);
  return success(res, {}, 'Report deleted successfully.');
});

module.exports = {
  uploadResume,
  analyzeResume,
  getHistory,
  getReportById,
  deleteReportById,
};
