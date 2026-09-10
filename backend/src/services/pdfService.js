const pdfParse = require('pdf-parse');
const AppError = require('../utils/AppError');
const { cleanExtractedText, isTextMeaningful } = require('../utils/textUtils');

const PDF_MAGIC_BYTES = '%PDF-';

/**
 * All PDF-specific logic (validation + text extraction) is isolated here
 * so future formats or OCR support can be added without touching
 * controllers or the analysis pipeline.
 */

function assertLooksLikePdf(buffer, mimetype) {
  if (mimetype !== 'application/pdf') {
    throw new AppError('Please upload a valid PDF resume.', 400, 'INVALID_FILE_TYPE');
  }

  if (!buffer || buffer.length === 0) {
    throw new AppError('The uploaded file is empty.', 400, 'EMPTY_FILE');
  }

  const header = buffer.slice(0, 5).toString('utf8');
  if (header !== PDF_MAGIC_BYTES) {
    throw new AppError('Please upload a valid PDF resume.', 400, 'INVALID_FILE_TYPE');
  }
}

async function extractTextFromPdf(buffer) {
  let parsed;
  try {
    parsed = await pdfParse(buffer);
  } catch (err) {
    throw new AppError(
      'We could not read this PDF. It may be corrupted or password protected.',
      422,
      'PDF_EXTRACTION_FAILED'
    );
  }

  const cleaned = cleanExtractedText(parsed.text);

  if (!isTextMeaningful(cleaned)) {
    throw new AppError(
      'We could not extract readable text from this PDF. Please upload a text-based resume.',
      422,
      'PDF_NOT_READABLE'
    );
  }

  return cleaned;
}

module.exports = { assertLooksLikePdf, extractTextFromPdf };
