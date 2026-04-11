import api from './api';

/**
 * Dashboard service
 */
const dashboardService = {
  getDashboardStats: (advocateId) => 
  api.get(`/dashboard?advocateId=${advocateId}`)
};

export default dashboardService;
