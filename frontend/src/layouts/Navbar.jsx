import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiMenu, FiX, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-200/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <FiBriefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Job<span className="text-indigo-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/jobs" className="text-slate-600 hover:text-indigo-600 transition-colors">
              Find Jobs
            </Link>
            <Link to="/companies" className="text-slate-600 hover:text-indigo-600 transition-colors">
              Companies
            </Link>
            {user?.role === 'candidate' && (
              <Link to="/candidate/profile" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Profile & Resume
              </Link>
            )}
            {user?.role === 'recruiter' && (
              <Link to="/recruiter/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Recruiter Hub
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Admin Portal
              </Link>
            )}
          </div>

          {/* User / CTA Area */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/notifications"
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors relative"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <Link
                    to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
                      {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
                    </div>
                    <span>{user?.first_name || user?.email?.split('@')[0]}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="gradient-btn text-sm px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
          >
            Companies
          </Link>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-indigo-600"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center gradient-btn px-4 py-2 text-sm font-medium rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
