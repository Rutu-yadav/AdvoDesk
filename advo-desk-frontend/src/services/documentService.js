import api from './api';

/**
 * Document service
 */
const documentService = {
  getAllDocuments: (advocateId = null) => {
    const url = advocateId ? `/documents?advocateId=${advocateId}` : '/documents';
    return api.get(url);
  },
  getDocumentById: (id) => api.get(`/documents/${id}`),
  getDocumentsByCaseId: (caseId) => api.get(`/documents/case/${caseId}`),
  
  uploadDocument: (formData) => {
    return api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  downloadDocument: (id) => {
    return api.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
  },
  
  deleteDocument: (id) => api.delete(`/documents/${id}`)
};

export default documentService;
