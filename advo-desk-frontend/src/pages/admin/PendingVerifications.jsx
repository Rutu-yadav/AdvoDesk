import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaClock, FaFileAlt } from 'react-icons/fa';
import api from '../../services/api';

const PendingVerifications = () => {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED, ALL
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/verification/history');
      setAdvocates(response.data);
    } catch (error) {
      console.error('Error fetching advocates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this advocate?')) {
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/verification/approve/${userId}`);
      alert('Advocate approved successfully!');
      fetchAdvocates();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve advocate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/verification/reject/${selectedAdvocate.id}`, {
        reason: rejectionReason
      });
      alert('Advocate rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedAdvocate(null);
      fetchAdvocates();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject advocate');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (advocate) => {
    setSelectedAdvocate(advocate);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedAdvocate(null);
  };

  const filteredAdvocates = advocates.filter(adv => {
    if (filter === 'ALL') return true;
    return adv.verificationStatus === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 border-green-300',
      REJECTED: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Advocate Verifications
          </h1>
          <p className="text-gray-600">
            Review and manage advocate registration verifications
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
                {status !== 'ALL' && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {advocates.filter(a => a.verificationStatus === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Advocates Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading advocates...</p>
          </div>
        ) : filteredAdvocates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No advocates found for this filter</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Advocate Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Enrollment Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Registration Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdvocates.map((advocate) => (
                    <tr key={advocate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{advocate.fullName}</div>
                          <div className="text-sm text-gray-600">{advocate.email}</div>
                          <div className="text-sm text-gray-500">@{advocate.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded inline-block">
                          {advocate.enrollmentNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(advocate.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(advocate.verificationStatus)}`}>
                          {advocate.verificationStatus}
                        </span>
                        {advocate.verificationStatus === 'REJECTED' && advocate.rejectionReason && (
                          <div className="text-xs text-red-600 mt-1">
                            Reason: {advocate.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          {advocate.verificationStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(advocate.id)}
                                disabled={actionLoading}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                <FaCheckCircle />
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(advocate)}
                                disabled={actionLoading}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                <FaTimesCircle />
                                Reject
                              </button>
                            </>
                          )}
                          {advocate.verificationStatus !== 'PENDING' && (
                            <span className="text-gray-400 text-sm">
                              Verified on {formatDate(advocate.verifiedAt)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Reject Advocate Verification
              </h3>
              <p className="text-gray-600 mb-4">
                Advocate: <strong>{selectedAdvocate?.fullName}</strong>
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="4"
                  placeholder="Please provide a reason for rejection..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
                <button
                  onClick={closeRejectModal}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingVerifications;
