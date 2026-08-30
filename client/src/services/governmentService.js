import api from './api';

export const getAnalytics = (params) => api.get('/government/analytics', { params });

export const getGovernmentChallenges = (params) => api.get('/government/challenges', { params });

export const getGovernmentProjects = () => api.get('/government/projects');

export const validateChallenge = (id) => api.post(`/government/challenges/${id}/validate`);