import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const systemService = {
  /**
   * Basic health check endpoint
   * GET /health
   */
  getHealth: async () => {
    const response = await api.get(API_ENDPOINTS.HEALTH);
    return response.data;
  },

  /**
   * API information endpoint
   * GET /
   */
  getApiInfo: async () => {
    const response = await api.get(API_ENDPOINTS.ROOT);
    return response.data;
  },
};

export default systemService;
