import api from './api';

export const submitChallenge = (formData) =>
  api.post('/challenges', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getMyChallenges = () => api.get('/challenges/my-challenges');

export const getChallenges = (params) => api.get('/challenges', { params });

export const getChallengeById = (id) => api.get(`/challenges/${id}`);

export const triggerAnalysis = (id) => api.post(`/challenges/${id}/analyze`);

export const acceptChallenge = (id) => api.post(`/challenges/${id}/accept`);

export const rejectChallenge = (id) => api.post(`/challenges/${id}/reject`);

export const deleteChallenge = (id) => api.delete(`/challenges/${id}`);