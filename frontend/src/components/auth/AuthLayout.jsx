import React from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiCheckCircle } from 'react-icons/fi';

const AuthLayout = ({
  children,
  title,
  subtitle,
  quoteText = '“JobConnect has completely streamlined our hiring pipeline. We scheduled and hired 14 senior engineers within two weeks.”',
  quoteAuthor = 'Sarah Lin, VP of Engineering at ScaleTech',
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <FiBriefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Job<span className="text-indigo-600">Connect</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/60 sm:rounded-2xl sm:px-10 border border-slate-200/80">
          {children}
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5" />
              Verified Companies
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5" />
              Real-Time Tracking
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5" />
              256-bit JWT Security
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
