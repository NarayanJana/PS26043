import api from './api';

export const getUsers = () => api.get('/admin/users');
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);

export const getAllUniversities = () => api.get('/admin/universities');
export const updateUniversity = (id, data) => api.put(`/admin/universities/${id}`, data);

export const getAllIndustries = () => api.get('/admin/industries');
export const updateIndustry = (id, data) => api.put(`/admin/industries/${id}`, data);