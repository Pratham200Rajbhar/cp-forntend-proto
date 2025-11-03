import { ok } from './mockUtils';
import { mockSystem } from './mockData';

const systemService = {
  /**
   * Basic health check endpoint
   * GET /health
   */
  getHealth: async () => ok(mockSystem.health),

  /**
   * API information endpoint
   * GET /
   */
  getApiInfo: async () => ok({ name: 'SmartAttend (Mock)', version: '1.0.0' }),
};

export default systemService;
