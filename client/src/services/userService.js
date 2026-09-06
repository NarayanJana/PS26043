import api from './api';

export const updateProfile = (data) => api.put('/users/me/profile', data);

export const changePassword = (data) => api.put('/users/me/password', data);

export const getMySettings = () => api.get('/users/me/settings');

export const updateNotificationSettings = (data) => api.put('/users/me/notifications', data);

export const updatePrivacySettings = (data) => api.put('/users/me/privacy', data);

export const logoutAllDevices = () => api.post('/users/me/logout-all');

export const deleteMyAccount = (password, confirmation) =>
  api.delete('/users/me', { data: { password, confirmation } });