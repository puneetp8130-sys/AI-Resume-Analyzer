import { apiClient } from './apiClient';

/**
 * All resume/report API calls live here. If the backend contract
 * changes (e.g. upload + analyze merge into one endpoint), only this
 * file needs to change — pages/components keep calling the same
 * function names.
 */

async function upload(file) {
  const formData = new FormData();
  formData.append('resume', file);
  return apiClient.post('/api/resume/upload', formData, { isFormData: true });
}

async function analyze({ fileName, targetRole, extractedText }) {
  const data = await apiClient.post('/api/resume/analyze', { fileName, targetRole, extractedText });
  return data.report;
}

async function getHistory() {
  const data = await apiClient.get('/api/resume/history');
  return data.reports;
}

async function getById(id) {
  const data = await apiClient.get(`/api/resume/${id}`);
  return data.report;
}

async function remove(id) {
  return apiClient.del(`/api/resume/${id}`);
}

export const resumeService = { upload, analyze, getHistory, getById, remove };
