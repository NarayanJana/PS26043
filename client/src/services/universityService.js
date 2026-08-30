import api from './api';

export const getUniversities = () => api.get('/universities');

export const getUniversityDashboard = () => api.get('/universities/dashboard');