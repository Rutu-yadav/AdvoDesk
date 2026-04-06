import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import dashboardService from "../../services/dashboardService";

const ClientDashboard = () => {
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
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="loading-spinner mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  const statCards = [
    {
      title: "My Cases",
      value: stats?.totalCases || 0,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Cases",
      value: stats?.openCases || 0,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Closed Cases",
      value: stats?.closedCases || 0,
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Upcoming Hearings",
      value: stats?.upcomingHearings || 0,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Create Request",
      description: "Submit a new legal request",
      link: "/client/request",
      color: "primary",
    },
    {
      title: "My Cases",
      description: "View your case status",
      link: "/client/cases",
      color: "secondary",
    },
    {
      title: "My Hearings",
      description: "Check hearing dates",
      link: "/client/hearings",
      color: "accent",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-secondary-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="mb-8">
            <h1 className="page-title">Client Dashboard</h1>
            <p className="text-gray-600 font-medium">
              Welcome! Manage your cases here.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`stat-card bg-gradient-to-br ${stat.gradient}`}
              >
                <h3 className="text-lg font-semibold text-white/90">
                  {stat.title}
                </h3>
                <p className="text-4xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="section-title">Quick Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="card hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;
