export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AUTH_TOKEN_STORAGE_KEY = 'ara_auth_token';
export const AUTH_USER_STORAGE_KEY = 'ara_auth_user';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  ANALYSIS: '/analysis/:id',
  HISTORY: '/history',
  REPORT: '/report/:id',
  NOT_FOUND: '*',
};

export const buildReportPath = (id) => `/report/${id}`;
export const buildAnalysisPath = (id) => `/analysis/${id}`;

export const MAX_RESUME_SIZE_MB = 5;
export const ACCEPTED_RESUME_TYPES = ['application/pdf'];

export const ATS_SCORE_BANDS = [
  { min: 85, label: 'Excellent match', color: 'green' },
  { min: 70, label: 'Strong resume foundation', color: 'brand' },
  { min: 50, label: 'Needs some improvement', color: 'yellow' },
  { min: 0, label: 'Significant gaps to address', color: 'red' },
];

export function getAtsScoreBand(score) {
  return ATS_SCORE_BANDS.find((band) => score >= band.min) || ATS_SCORE_BANDS[ATS_SCORE_BANDS.length - 1];
}
