import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import clientService from '../services/clientService';
import { useAuth } from '../context/AuthContext';

const ClientManagement = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const advocateId = user?.role === 'ADVOCATE' ? user.id : null;
      const response = await clientService.getAllClients(advocateId);
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    if (!validateForm()) return;

    try {
      if (editingClient) {
        await clientService.updateClient(editingClient.id, formData);
      } else {
        const dataToSend = { ...formData, createdBy: user.id };
        await clientService.createClient(dataToSend);
      }
      setShowForm(false);
      setEditingClient(null);
      setFormData({ fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
      loadClients();
    } catch (error) {
      if (error.response?.data && typeof error.response.data === 'object') {
        setFieldErrors(error.response.data);
      } else {
        console.error('Error saving client:', error);
        alert('Error saving client: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error deleting client');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            {user?.role === 'ADVOCATE' && (
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? 'Cancel' : 'Add Client'}
              </button>
            )}
          </div>

          {showForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.fullName ? 'border-red-500' : ''}`} placeholder="Full Name *" value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                  {fieldErrors.fullName && <span className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</span>}
                </div>

                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.email ? 'border-red-500' : ''}`} type="email" placeholder="Email *" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  {fieldErrors.email && <span className="text-red-500 text-xs mt-1">{fieldErrors.email}</span>}
                </div>

                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.phone ? 'border-red-500' : ''}`} placeholder="Phone (10 digits) *" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  {fieldErrors.phone && <span className="text-red-500 text-xs mt-1">{fieldErrors.phone}</span>}
                </div>

                <div className="flex flex-col">
                  <input className="input-field" placeholder="City" value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </div>

                <div className="flex flex-col">
                  <input className="input-field" placeholder="State" value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})} />
                </div>

                <div className="flex flex-col">
                  <input className={`input-field ${fieldErrors.pincode ? 'border-red-500' : ''}`} placeholder="Pincode (6 digits)" value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
                  {fieldErrors.pincode && <span className="text-red-500 text-xs mt-1">{fieldErrors.pincode}</span>}
                </div>

                <textarea className="input-field md:col-span-2" placeholder="Address" value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" />
                
                <button type="submit" className="btn-primary md:col-span-2">
                  {editingClient ? 'Update Client' : 'Create Client'}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id} className="table-row">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.fullName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{client.city}</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {user?.role === 'ADVOCATE' ? (
                            <>
                              <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-800">Edit</button>
                              <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-800">Delete</button>
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

export default ClientManagement;
