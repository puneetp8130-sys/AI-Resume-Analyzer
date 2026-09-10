/**
 * OPTIONAL mock adapter — implements the exact same function signatures as
 * resumeService so it can be swapped in during frontend-only development
 * before the backend is ready, without touching any page or component.
 *
 * Not used by default. To use it temporarily:
 *   import { resumeService } from './mockResumeService';
 * instead of:
 *   import { resumeService } from './resumeService';
 *
 * Remove this file (and any temporary import swap) once real backend
 * integration is verified end-to-end.
 */

const MOCK_DELAY_MS = 600;

const mockReports = new Map();
let nextId = 1;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

async function upload(file) {
  return delay({ fileName: file.name, extractedText: `Mock extracted text for ${file.name}` });
}

async function analyze({ fileName, targetRole }) {
  const id = String(nextId++);
  const report = {
    id,
    fileName,
    targetRole: targetRole || '',
    atsScore: 74,
    summary: 'This is placeholder mock analysis used only when no backend is connected.',
    strengths: ['Clear formatting', 'Quantified achievements'],
    weaknesses: ['Missing a professional summary', 'Limited use of action verbs'],
    skills: ['JavaScript', 'React', 'Node.js'],
    missingSkills: ['TypeScript', 'CI/CD'],
    keywords: ['frontend', 'REST API', 'agile'],
    sectionFeedback: [{ section: 'Experience', feedback: 'Add measurable outcomes to each bullet point.' }],
    suggestions: ['Add a summary section', 'Include specific metrics for each achievement'],
    createdAt: new Date().toISOString(),
  };
  mockReports.set(id, report);
  return delay(report);
}

async function getHistory() {
  return delay(Array.from(mockReports.values()));
}

async function getById(id) {
  const report = mockReports.get(id);
  if (!report) {
    const error = new Error('This report could not be found.');
    error.code = 'REPORT_NOT_FOUND';
    throw error;
  }
  return delay(report);
}

async function remove(id) {
  mockReports.delete(id);
  return delay({});
}

export const mockResumeService = { upload, analyze, getHistory, getById, remove };
