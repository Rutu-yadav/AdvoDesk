import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import dashboardService from '../services/dashboardService';

const AdvocateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Advocate Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Cases</h3>
              <p className="text-4xl font-bold">{stats?.totalCases || 0}</p>
            </div>
            
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <h3 className="text-lg font-semibold mb-2">Open Cases</h3>
              <p className="text-4xl font-bold">{stats?.openCases || 0}</p>
            </div>
            
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <h3 className="text-lg font-semibold mb-2">Upcoming Hearings</h3>
              <p className="text-4xl font-bold">{stats?.upcomingHearings || 0}</p>
            </div>
            
            <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Clients</h3>
              <p className="text-4xl font-bold">{stats?.totalClients || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/clients" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-primary-700 mb-2">Clients</h3>
              <p className="text-gray-600">View and manage client information</p>
            </Link>
            
            <Link to="/cases" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-primary-700 mb-2">Cases</h3>
              <p className="text-gray-600">Manage your legal cases</p>
            </Link>
            
            <Link to="/hearings" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-primary-700 mb-2">Hearings</h3>
              <p className="text-gray-600">View and schedule hearings</p>
            </Link>
            
            <Link to="/documents" className="card hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-primary-700 mb-2">Documents</h3>
              <p className="text-gray-600">Manage case documents</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvocateDashboard;
