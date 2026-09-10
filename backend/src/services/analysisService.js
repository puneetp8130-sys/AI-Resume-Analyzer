const ResumeAnalysis = require('../models/ResumeAnalysis');
const AppError = require('../utils/AppError');
const pdfService = require('./pdfService');
const aiService = require('./aiService');

/**
 * Orchestrates the full upload -> extract -> analyze -> persist pipeline.
 * Controllers call into this service only; they never talk to pdfService
 * or aiService directly.
 */

async function extractResumeText(file) {
  pdfService.assertLooksLikePdf(file.buffer, file.mimetype);
  const text = await pdfService.extractTextFromPdf(file.buffer);
  return text;
}

async function analyzeAndSave({ userId, fileName, targetRole, resumeText }) {
  const normalizedReport = await aiService.analyzeResumeText(resumeText, targetRole);

  const analysis = await ResumeAnalysis.create({
    userId,
    fileName,
    targetRole: targetRole || '',
    ...normalizedReport,
  });

  return analysis.toReportObject();
}

async function getHistoryForUser(userId) {
  const analyses = await ResumeAnalysis.find({ userId }).sort({ createdAt: -1 });
  return analyses.map((analysis) => analysis.toReportObject());
}

async function getOwnedAnalysisById(userId, analysisId) {
  const analysis = await ResumeAnalysis.findOne({ _id: analysisId, userId });
  if (!analysis) {
    throw new AppError('This report could not be found.', 404, 'REPORT_NOT_FOUND');
  }
  return analysis.toReportObject();
}

async function deleteOwnedAnalysisById(userId, analysisId) {
  const analysis = await ResumeAnalysis.findOneAndDelete({ _id: analysisId, userId });
  if (!analysis) {
    throw new AppError('This report could not be found.', 404, 'REPORT_NOT_FOUND');
  }
  return true;
}

module.exports = {
  extractResumeText,
  analyzeAndSave,
  getHistoryForUser,
  getOwnedAnalysisById,
  deleteOwnedAnalysisById,
};
