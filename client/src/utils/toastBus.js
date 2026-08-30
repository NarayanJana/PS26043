let listeners = [];

export const subscribeToToasts = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};

export const showToast = (message, type = 'error') => {
  listeners.forEach((callback) => callback({ message, type, id: Date.now() + Math.random() }));
};