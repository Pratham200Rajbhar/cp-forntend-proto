// Mock mode: remove axios; this module remains only to avoid import errors.
const api = {
  get: async () => {
    throw new Error('Network disabled: running in mock mode');
  },
  post: async () => {
    throw new Error('Network disabled: running in mock mode');
  },
  put: async () => {
    throw new Error('Network disabled: running in mock mode');
  },
  delete: async () => {
    throw new Error('Network disabled: running in mock mode');
  },
};

export default api;

