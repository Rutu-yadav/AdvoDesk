import api from './api';

/**
 * Dashboard service
 */
const dashboardService = {
  getDashboardStats: () => api.get('/dashboard/stats')
};

export default dashboardService;
