const env = require('../config/env');
const AppError = require('../utils/AppError');

const GEMINI_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const REQUIRED_ARRAY_FIELDS = [
  'strengths',
  'weaknesses',
  'skills',
  'missingSkills',
  'keywords',
  'suggestions',
];

/**
 * The ONLY module in the codebase that knows about Gemini. Controllers and
 * routes must never call Gemini directly. If the provider changes in the
 * future, only this file needs to change.
 */

function buildPrompt(resumeText, targetRole) {
  const roleLine = targetRole
    ? `The candidate is targeting this role: "${targetRole}".`
    : 'No specific target role was provided; evaluate the resume generally.';

  return `You are an expert ATS (Applicant Tracking System) resume reviewer.
${roleLine}

Analyze the resume text below and respond with ONLY a single valid JSON object
(no markdown, no code fences, no commentary) matching exactly this shape:

{
  "atsScore": number (0-100),
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "skills": string[],
  "missingSkills": string[],
  "keywords": string[],
  "sectionFeedback": [{ "section": string, "feedback": string }],
  "suggestions": string[]
}

Resume text:
"""
${resumeText}
"""`;
}

function extractJsonString(rawText) {
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) return fencedMatch[1].trim();

  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return rawText.slice(firstBrace, lastBrace + 1);
  }
  return rawText.trim();
}

/**
 * Validates and normalizes a parsed AI JSON object into the exact shape
 * the rest of the application (DB + frontend) expects. Throws
 * AppError('AI_MALFORMED_RESPONSE') if the shape cannot be trusted.
 */
function normalizeAiOutput(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new AppError('Resume analysis returned an unexpected response.', 502, 'AI_MALFORMED_RESPONSE');
  }

  const atsScoreRaw = Number(parsed.atsScore);
  const atsScore = Number.isFinite(atsScoreRaw) ? Math.min(100, Math.max(0, Math.round(atsScoreRaw))) : 0;

  const toStringArray = (value) =>
    Array.isArray(value) ? value.filter((v) => typeof v === 'string' && v.trim().length > 0) : [];

  const sectionFeedback = Array.isArray(parsed.sectionFeedback)
    ? parsed.sectionFeedback
        .filter((item) => item && typeof item.section === 'string' && typeof item.feedback === 'string')
        .map((item) => ({ section: item.section.trim(), feedback: item.feedback.trim() }))
    : [];

  const normalized = {
    atsScore,
    summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
    strengths: toStringArray(parsed.strengths),
    weaknesses: toStringArray(parsed.weaknesses),
    skills: toStringArray(parsed.skills),
    missingSkills: toStringArray(parsed.missingSkills),
    keywords: toStringArray(parsed.keywords),
    sectionFeedback,
    suggestions: toStringArray(parsed.suggestions),
  };

  const hasAnySignal =
    normalized.summary ||
    REQUIRED_ARRAY_FIELDS.some((field) => normalized[field].length > 0) ||
    normalized.sectionFeedback.length > 0;

  if (!hasAnySignal) {
    throw new AppError('Resume analysis returned an incomplete response.', 502, 'AI_MALFORMED_RESPONSE');
  }

  return normalized;
}

async function callGemini(prompt) {
  if (!env.geminiApiKey) {
    throw new AppError(
      'Resume analysis is temporarily unavailable. Please try again later.',
      503,
      'AI_NOT_CONFIGURED'
    );
  }

  const url = `${GEMINI_ENDPOINT_BASE}/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
      }),
    });
  } catch (err) {
    throw new AppError('Resume analysis is temporarily unavailable. Please try again.', 503, 'AI_UNAVAILABLE');
  }

  if (!response.ok) {
    throw new AppError('Resume analysis is temporarily unavailable. Please try again.', 503, 'AI_UNAVAILABLE');
  }

  const payload = await response.json();
  const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new AppError('Resume analysis returned an empty response.', 502, 'AI_MALFORMED_RESPONSE');
  }

  return rawText;
}

/**
 * Runs the resume text through Gemini and returns a normalized,
 * validated report object. Never persists anything itself.
 */
async function analyzeResumeText(resumeText, targetRole) {
  const prompt = buildPrompt(resumeText, targetRole);
  const rawText = await callGemini(prompt);
  const jsonString = extractJsonString(rawText);

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new AppError('Resume analysis returned an invalid response.', 502, 'AI_MALFORMED_RESPONSE');
  }

  return normalizeAiOutput(parsed);
}

module.exports = { analyzeResumeText, normalizeAiOutput, buildPrompt };
