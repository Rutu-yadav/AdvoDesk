import api from './api';

/**
 * Case service
 */
const caseService = {
  getAllCases: (advocateId = null) => {
    const url = advocateId ? `/cases?advocateId=${advocateId}` : '/cases';
    return api.get(url);
  },
  getCaseById: (id) => api.get(`/cases/${id}`),
  getCasesByClientId: (clientId) => api.get(`/cases/client/${clientId}`),
  getCasesByStatus: (status) => api.get(`/cases/status/${status}`),
  createCase: (caseData) => api.post('/cases', caseData),
  updateCase: (id, caseData) => api.put(`/cases/${id}`, caseData),
  deleteCase: (id) => api.delete(`/cases/${id}`)
};

export default caseService;
