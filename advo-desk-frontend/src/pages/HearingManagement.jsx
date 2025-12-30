import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import hearingService from '../services/hearingService';
import caseService from '../services/caseService';
import { useAuth } from '../context/AuthContext';

const HearingManagement = () => {
  const { user } = useAuth();
  const [hearings, setHearings] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHearing, setEditingHearing] = useState(null);
  const [formData, setFormData] = useState({
    caseId: '', hearingDate: '', hearingType: '', courtRoom: '', judgeName: '', notes: '', status: 'SCHEDULED'
  });

  useEffect(() => {
    loadHearings();
    loadCases();
  }, []);

  const loadHearings = async () => {
    try {
      const advocateId = user?.role === 'ADVOCATE' ? user.id : null;
      const response = await hearingService.getAllHearings(advocateId);
      setHearings(response.data);
    } catch (error) {
      console.error('Error loading hearings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCases = async () => {
    try {
      const advocateId = user?.role === 'ADVOCATE' ? user.id : null;
      const response = await caseService.getAllCases(advocateId);
      setCases(response.data);
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHearing) {
        await hearingService.updateHearing(editingHearing.id, formData);
      } else {
        await hearingService.createHearing(formData);
      }
      setShowForm(false);
      setEditingHearing(null);
      setFormData({ caseId: '', hearingDate: '', hearingType: '', courtRoom: '', judgeName: '', notes: '', status: 'SCHEDULED' });
      loadHearings();
    } catch (error) {
      console.error('Error saving hearing:', error);
      alert('Error saving hearing');
    }
  };

  const handleEdit = (hearing) => {
    setEditingHearing(hearing);
    setFormData({
      caseId: hearing.caseId,
      hearingDate: hearing.hearingDate,
      hearingType: hearing.hearingType,
      courtRoom: hearing.courtRoom,
      judgeName: hearing.judgeName,
      notes: hearing.notes,
      status: hearing.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hearing?')) {
      try {
        await hearingService.deleteHearing(id);
        loadHearings();
      } catch (error) {
        console.error('Error deleting hearing:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Hearing Management</h1>
            {user?.role === 'ADVOCATE' && (
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? 'Cancel' : 'Schedule Hearing'}
              </button>
            )}
          </div>

          {showForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">{editingHearing ? 'Edit Hearing' : 'Schedule New Hearing'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select className="input-field" value={formData.caseId}
                  onChange={(e) => setFormData({...formData, caseId: e.target.value})} required>
                  <option value="">Select Case</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.caseNumber} - {c.caseTitle}</option>
                  ))}
                </select>
                <input className="input-field" type="datetime-local" value={formData.hearingDate}
                  onChange={(e) => setFormData({...formData, hearingDate: e.target.value})} required />
                <input className="input-field" placeholder="Hearing Type" value={formData.hearingType}
                  onChange={(e) => setFormData({...formData, hearingType: e.target.value})} />
                <input className="input-field" placeholder="Court Room" value={formData.courtRoom}
                  onChange={(e) => setFormData({...formData, courtRoom: e.target.value})} />
                <input className="input-field" placeholder="Judge Name" value={formData.judgeName}
                  onChange={(e) => setFormData({...formData, judgeName: e.target.value})} />
                <select className="input-field" value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="POSTPONED">Postponed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <textarea className="input-field md:col-span-2" placeholder="Notes" value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" />
                <button type="submit" className="btn-primary md:col-span-2">
                  {editingHearing ? 'Update Hearing' : 'Schedule Hearing'}
                </button>
              </form>
            </div>
          )}

          <div className="card">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="table-header">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Court Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judge</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hearings.map((hearing) => (
                      <tr key={hearing.id} className="table-row">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{hearing.caseNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(hearing.hearingDate).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{hearing.hearingType}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{hearing.courtRoom}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{hearing.judgeName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            hearing.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            hearing.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{hearing.status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {user?.role === 'ADVOCATE' ? (
                            <>
                              <button onClick={() => handleEdit(hearing)} className="text-blue-600 hover:text-blue-800">Edit</button>
                              <button onClick={() => handleDelete(hearing.id)} className="text-red-600 hover:text-red-800">Delete</button>
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

export default HearingManagement;
