import api from './api';

/**
 * Client service
 */
const clientService = {
  getAllClients: (advocateId = null) => {
    const url = advocateId ? `/clients?advocateId=${advocateId}` : '/clients';
    return api.get(url);
  },
  getClientById: (id) => api.get(`/clients/${id}`),
  createClient: (clientData) => api.post('/clients', clientData),
  updateClient: (id, clientData) => api.put(`/clients/${id}`, clientData),
  deleteClient: (id) => api.delete(`/clients/${id}`),
  searchClients: (name) => api.get(`/clients/search?name=${name}`)
};

export default clientService;
