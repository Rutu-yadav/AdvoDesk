import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-display font-bold hover:scale-105 transition-transform duration-200">
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                AdvoDesk
              </span>
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-2">
                <Link 
                  to={
                    user.role === 'ADMIN' ? '/admin-dashboard' :
                    user.role === 'ADVOCATE' ? '/advocate-dashboard' :
                    '/client-dashboard'
                  } 
                  className="px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200 font-medium"
                >
                  Dashboard
                </Link>
                
                {(user.role === 'ADMIN' || user.role === 'ADVOCATE') && (
                  <>
                    <Link to="/clients" className="px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200 font-medium">
                      Clients
                    </Link>
                    <Link to="/cases" className="px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200 font-medium">
                      Cases
                    </Link>
                    <Link to="/hearings" className="px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200 font-medium">
                      Hearings
                    </Link>
                    <Link to="/documents" className="px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200 font-medium">
                      Documents
                    </Link>
                  </>
                )}
                
                {user.role === 'CLIENT' && (
                  <>
                    <Link to="/my-cases" className="px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200 font-medium">
                      My Cases
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.fullName}</span>
                  <span className="text-xs text-primary-100">{user.role}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 px-4 py-2 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
