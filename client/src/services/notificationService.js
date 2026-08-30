import api from './api';

export const getMyNotifications = () => api.get('/notifications');

export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);

export const markAllNotificationsAsRead = () => api.put('/notifications/read-all');