import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShield, FiArrowLeft } from 'react-icons/fi';

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role;
  const hasAccess =
    allowedRoles.includes(userRole) ||
    user?.is_superuser ||
    (allowedRoles.includes('admin') && (user?.is_staff || userRole === 'admin'));

  if (!hasAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h3>
          <p className="text-sm text-slate-600 mb-6">
            Your current account role (<span className="font-semibold text-slate-800 capitalize">{userRole}</span>) does not have permission to view this section.
          </p>
          <Link
            to={userRole === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
            className="inline-flex items-center gap-2 gradient-btn px-5 py-2.5 rounded-xl text-sm font-medium"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleRoute;
