import api from './api';

export const createProject = (challengeId) => api.post('/projects', { challengeId });

export const getProjects = () => api.get('/projects');

export const getProjectById = (id) => api.get(`/projects/${id}`);

export const updateProject = (id, data) => api.put(`/projects/${id}`, data);

export const addProjectUpdate = (id, text) => api.post(`/projects/${id}/updates`, { text });

export const uploadProjectDocuments = (id, formData) =>
  api.post(`/projects/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateMilestone = (projectId, milestoneId, data) =>
  api.put(`/projects/${projectId}/milestones/${milestoneId}`, data);
export const updateIndustryPartnerStatus = (projectId, partnerId, status) =>
  api.put(`/projects/${projectId}/industry/${partnerId}`, { status });