import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import documentService from '../services/documentService';
import caseService from '../services/caseService';
import { useAuth } from '../context/AuthContext';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    caseId: '', documentType: '', description: ''
  });

  useEffect(() => {
    loadDocuments();
    loadCases();
  }, []);

  const loadDocuments = async () => {
    try {
      const advocateId = user?.role === 'ADVOCATE' ? user.id : null;
      const response = await documentService.getAllDocuments(advocateId);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error loading documents:', error);
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
    if (!file) {
      alert('Please select a file');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('caseId', formData.caseId);
      formDataToSend.append('uploadedBy', user.id);
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append('description', formData.description);

      await documentService.uploadDocument(formDataToSend);
      setShowForm(false);
      setFile(null);
      setFormData({ caseId: '', documentType: '', description: '' });
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document');
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const response = await documentService.downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(id);
        loadDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            {user?.role === 'ADVOCATE' && (
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? 'Cancel' : 'Upload Document'}
              </button>
            )}
          </div>

          {showForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Upload New Document</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
                  <select className="input-field" value={formData.caseId}
                    onChange={(e) => setFormData({...formData, caseId: e.target.value})} required>
                    <option value="">Select Case</option>
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>{c.caseNumber} - {c.caseTitle}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                  <input className="input-field" placeholder="e.g., Legal Document, Evidence, etc."
                    value={formData.documentType}
                    onChange={(e) => setFormData({...formData, documentType: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea className="input-field" placeholder="Document description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                  <input type="file" className="input-field" onChange={(e) => setFile(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn-primary w-full">Upload Document</button>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="table-row">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.documentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.caseNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.documentType}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedByName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button onClick={() => handleDownload(doc.id, doc.documentName)}
                            className="text-green-600 hover:text-green-800">Download</button>
                          {user?.role === 'ADVOCATE' && (
                            <button onClick={() => handleDelete(doc.id)}
                              className="text-red-600 hover:text-red-800">Delete</button>
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

export default DocumentManagement;
