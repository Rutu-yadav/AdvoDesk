import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import dashboardService from "../../services/dashboardService";
import api from "../../services/api";
import requestService from "../../services/RequestService";
import { useAuth } from "../../context/AuthContext";

const ClientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advocates, setAdvocates] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadStats();
      loadAdvocates();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await dashboardService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadAdvocates = async () => {
    try {
      const res = await api.get("/advocates");
      setAdvocates(res.data);
    } catch (err) {
      console.error("Error loading advocates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdvocate = async (advocateId) => {
    try {
      if (!user || !user.id) {
        alert("User not loaded properly ❌");
        return;
      }

      await requestService.sendRequest(user.id, advocateId);
      alert("Request sent successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error sending request ❌");
    }
  };

  if (loading || !user) {
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
    },
    {
      title: "My Cases",
      description: "View your case status",
      link: "/client/cases",
    },
    {
      title: "My Hearings",
      description: "Check hearing dates",
      link: "/client/hearings",
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
              <div key={index} className={`stat-card bg-gradient-to-br ${stat.gradient}`}>
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
                <Link key={index} to={action.link} className="card hover:shadow-xl transition">
                  <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* 🔥 Available Advocates */}
          <div className="mt-10">
            <h2 className="section-title">Available Advocates</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advocates.map((adv) => (
                <div key={adv.id} className="card">
                  <h3 className="text-lg font-semibold">{adv.fullName}</h3>
                  <p className="text-gray-600">Email: {adv.email}</p>
                  <p className="text-gray-600">Phone: {adv.phone}</p>

                  <button
                    onClick={() => handleSelectAdvocate(adv.id)}
                    className="btn-primary mt-3"
                  >
                    Select Advocate
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ClientDashboard;