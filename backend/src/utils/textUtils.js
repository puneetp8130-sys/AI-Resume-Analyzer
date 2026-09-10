/**
 * Small text-cleanup helpers used when preparing extracted PDF text
 * before it is sent to the AI service.
 */

function cleanExtractedText(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function isTextMeaningful(text, minLength = 40) {
  return Boolean(text) && text.trim().length >= minLength;
}

module.exports = { cleanExtractedText, isTextMeaningful };
