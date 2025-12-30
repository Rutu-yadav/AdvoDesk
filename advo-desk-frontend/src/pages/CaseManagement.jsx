import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import caseService from '../services/caseService';
import clientService from '../services/clientService';
import { useAuth } from '../context/AuthContext';
import { CASE_TYPES, CASE_STATUS } from '../utils/constants';

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    caseNumber: '', caseTitle: '', caseType: 'CIVIL', courtName: '', caseStatus: 'OPEN',
    description: '', filingDate: '', clientId: '', createdBy: user?.id || ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    loadCases();
    loadClients();
  }, []);

  const loadCases = async () => {
    try {
      const advocateId = user?.role === 'ADVOCATE' ? user.id : null;
      const response = await caseService.getAllCases(advocateId);
      setCases(response.data);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clientService.getAllClients();
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const dataToSend = { ...formData, createdBy: user.id };
      if (editingCase) {
        await caseService.updateCase(editingCase.id, dataToSend);
      } else {
        await caseService.createCase(dataToSend);
      }
      setShowForm(false);
      setEditingCase(null);
      setFormData({ caseNumber: '', caseTitle: '', caseType: 'CIVIL', courtName: '', caseStatus: 'OPEN',
        description: '', filingDate: '', clientId: '', createdBy: user.id });
      loadCases();
    } catch (error) {
      if (error.response?.data && typeof error.response.data === 'object') {
        setFieldErrors(error.response.data);
      } else {
        console.error('Error saving case:', error);
        alert('Error saving case: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({
      caseNumber: caseItem.caseNumber,
      caseTitle: caseItem.caseTitle,
      caseType: caseItem.caseType,
      courtName: caseItem.courtName,
      caseStatus: caseItem.caseStatus,
      description: caseItem.description,
      filingDate: caseItem.filingDate,
      clientId: caseItem.clientId,
      createdBy: caseItem.createdBy
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await caseService.deleteCase(id);
        loadCases();
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-secondary-50/20 py-8 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="page-title">Case Management</h1>
              <p className="text-gray-600 font-medium">Manage and track all legal cases</p>
            </div>
            {user?.role === 'ADVOCATE' && (
              <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center">
                {showForm ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Case
                  </>
                )}
              </button>
            )}
          </div>

          {showForm && (
            <div className="card mb-8 animate-slide-down">
              <h2 className="section-title">{editingCase ? 'Edit Case' : 'Add New Case'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.caseNumber ? 'border-red-500' : ''}`} placeholder="Case Number *" value={formData.caseNumber}
                    onChange={(e) => setFormData({...formData, caseNumber: e.target.value})} required />
                  {fieldErrors.caseNumber && <span className="text-red-500 text-xs mt-1">{fieldErrors.caseNumber}</span>}
                </div>

                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.caseTitle ? 'border-red-500' : ''}`} placeholder="Case Title *" value={formData.caseTitle}
                    onChange={(e) => setFormData({...formData, caseTitle: e.target.value})} required />
                  {fieldErrors.caseTitle && <span className="text-red-500 text-xs mt-1">{fieldErrors.caseTitle}</span>}
                </div>

                <div className="flex flex-col">
                  <select className={`input-field ${fieldErrors.caseType ? 'border-red-500' : ''}`} value={formData.caseType}
                    onChange={(e) => setFormData({...formData, caseType: e.target.value})}>
                    <option value="CIVIL">Civil</option>
                    <option value="CRIMINAL">Criminal</option>
                  </select>
                  {fieldErrors.caseType && <span className="text-red-500 text-xs mt-1">{fieldErrors.caseType}</span>}
                </div>

                <div className="flex flex-col">
                  <select className={`input-field ${fieldErrors.caseStatus ? 'border-red-500' : ''}`} value={formData.caseStatus}
                    onChange={(e) => setFormData({...formData, caseStatus: e.target.value})}>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                  {fieldErrors.caseStatus && <span className="text-red-500 text-xs mt-1">{fieldErrors.caseStatus}</span>}
                </div>

                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.courtName ? 'border-red-500' : ''}`} placeholder="Court Name *" value={formData.courtName}
                    onChange={(e) => setFormData({...formData, courtName: e.target.value})} required />
                  {fieldErrors.courtName && <span className="text-red-500 text-xs mt-1">{fieldErrors.courtName}</span>}
                </div>

                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.filingDate ? 'border-red-500' : ''}`} type="date" value={formData.filingDate}
                    onChange={(e) => setFormData({...formData, filingDate: e.target.value})} required />
                  {fieldErrors.filingDate && <span className="text-red-500 text-xs mt-1">{fieldErrors.filingDate}</span>}
                </div>

                <div className="flex flex-col">
                  <select className={`input-field ${fieldErrors.clientId ? 'border-red-500' : ''}`} value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})} required>
                    <option value="">Select Client *</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.fullName}</option>
                    ))}
                  </select>
                  {fieldErrors.clientId && <span className="text-red-500 text-xs mt-1">{fieldErrors.clientId}</span>}
                </div>

                <div className="h-full" />

                <textarea className="input-field md:col-span-2" placeholder="Description" value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" />
                
                <button type="submit" className="btn-primary md:col-span-2 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editingCase ? 'Update Case' : 'Create Case'}
                </button>
              </form>
            </div>
          )}

          <div className="card">
            {loading ? (
              <div className="text-center py-12">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading cases...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="table-header">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cases.map((caseItem) => (
                      <tr key={caseItem.id} className="table-row">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{caseItem.caseNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{caseItem.caseTitle}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{caseItem.clientName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{caseItem.caseType}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${
                            caseItem.caseStatus === 'OPEN' ? 'badge-success' :
                            caseItem.caseStatus === 'WON' ? 'badge-info' :
                            caseItem.caseStatus === 'CLOSED' ? 'badge-warning' :
                            'badge-danger'
                          }`}>{caseItem.caseStatus}</span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {user?.role === 'ADVOCATE' ? (
                            <>
                              <button onClick={() => handleEdit(caseItem)} className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button onClick={() => handleDelete(caseItem.id)} className="inline-flex items-center px-3 py-1.5 bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors font-medium">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">View Only</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseManagement;
