import api from './api';

export const getOpportunities = () => api.get('/industry/opportunities');

export const getIndustryDashboard = () => api.get('/industry/dashboard');

export const expressInterest = (projectId, supportType) =>
  api.post('/industry/collaborate', { projectId, supportType });