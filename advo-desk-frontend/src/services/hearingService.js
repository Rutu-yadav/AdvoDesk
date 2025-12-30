import api from './api';

/**
 * Hearing service
 */
const hearingService = {
  getAllHearings: (advocateId = null) => {
    const url = advocateId ? `/hearings?advocateId=${advocateId}` : '/hearings';
    return api.get(url);
  },
  getHearingById: (id) => api.get(`/hearings/${id}`),
  getHearingsByCaseId: (caseId) => api.get(`/hearings/case/${caseId}`),
  getUpcomingHearings: () => api.get('/hearings/upcoming'),
  createHearing: (hearingData) => api.post('/hearings', hearingData),
  updateHearing: (id, hearingData) => api.put(`/hearings/${id}`, hearingData),
  deleteHearing: (id) => api.delete(`/hearings/${id}`)
};

export default hearingService;
