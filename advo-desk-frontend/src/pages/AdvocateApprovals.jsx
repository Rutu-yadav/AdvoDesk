import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaEye, FaDownload } from 'react-icons/fa';

const AdvocateApprovals = () => {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadPendingAdvocates();
  }, []);

  const loadPendingAdvocates = async () => {
    try {
      const response = await api.get('/admin/advocates/pending');
      setAdvocates(response.data);
    } catch (error) {
      console.error('Error loading pending advocates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (advocateId) => {
    try {
      await api.post('/admin/advocates/approve', {
        advocateId: advocateId,
        adminId: user.id
      });
      alert('Advocate approved successfully!');
      loadPendingAdvocates();
      setSelectedAdvocate(null);
    } catch (error) {
      alert('Error approving advocate: ' + (error.response?.data || error.message));
    }
  };

  const handleReject = async (advocateId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await api.post('/admin/advocates/reject', {
        advocateId: advocateId,
        adminId: user.id,
        rejectionReason: rejectionReason
      });
      alert('Advocate rejected successfully!');
      loadPendingAdvocates();
      setSelectedAdvocate(null);
      setRejectionReason('');
    } catch (error) {
      alert('Error rejecting advocate: ' + (error.response?.data || error.message));
    }
  };

  const viewDocument = async (advocateId) => {
    if (advocateId) {
      try {
        const response = await api.get(`/admin/advocates/${advocateId}/enrollment-doc`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error viewing document:', error);
        alert('Error viewing document');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading-spinner mb-4"></div>
            <p className="text-gray-600">Loading pending advocates...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="page-title">Advocate Approvals</h1>
            <p className="text-gray-600">Review and approve pending advocate registrations</p>
          </div>

          {advocates.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending advocate approvals at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {advocates.map((advocate) => (
                <div key={advocate.id} className="card hover:shadow-xl transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Advocate Details */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Advocate Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-gray-900 font-medium">{advocate.fullName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Username</label>
                          <p className="text-gray-900">{advocate.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{advocate.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{advocate.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Enrollment Number</label>
                          <p className="text-gray-900 font-semibold text-lg">{advocate.enrollmentNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Registration Date</label>
                          <p className="text-gray-900">{new Date(advocate.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
                      
                      {/* View Document */}
                        <button
                          onClick={() => viewDocument(advocate.id)}
                          className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FaEye /> View Enrollment Document
                        </button>

                      {/* Approve Button */}
                      <button
                        onClick={() => handleApprove(advocate.id)}
                        className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaCheckCircle /> Approve Advocate
                      </button>

                      {/* Reject Section */}
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                          rows="3"
                          placeholder="Enter reason for rejection..."
                        />
                        <button
                          onClick={() => handleReject(advocate.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTimesCircle /> Reject Advocate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvocateApprovals;
