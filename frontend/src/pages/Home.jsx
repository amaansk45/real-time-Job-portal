import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiTrendingUp,
  FiCheckCircle,
  FiShield,
  FiUsers,
  FiArrowRight,
} from 'react-icons/fi';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const popularSearches = [
    'Python Developer',
    'React Developer',
    'Django Developer',
    'Full Stack Developer',
    'DevOps Engineer',
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Real-Time Applicant & Interview Tracking Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Find Your Next Career Move,{' '}
            <span className="gradient-text">Connected in Real-Time</span>
          </h1>

          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of curated tech opportunities, apply with verified resumes, and schedule interviews with world-class engineering teams.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-4xl mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-200/90 grid grid-cols-1 md:grid-cols-12 gap-3"
          >
            <div className="md:col-span-5 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
              <FiSearch className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm text-slate-800 focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="md:col-span-4 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
              <FiMapPin className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="City, State, or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm text-slate-800 focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] gradient-btn rounded-xl flex items-center justify-center gap-2 font-semibold text-sm"
              >
                <span>Find Jobs</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Popular Search Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-600">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  navigate(`/jobs?search=${encodeURIComponent(term)}`);
                }}
                className="px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-full transition-colors font-medium shadow-2xs"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="text-center border-r border-slate-100 last:border-r-0">
            <div className="text-3xl md:text-4xl font-extrabold text-indigo-600">12,500+</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">Verified Active Jobs</div>
          </div>
          <div className="text-center border-r border-slate-100 last:border-r-0">
            <div className="text-3xl md:text-4xl font-extrabold text-purple-600">3,400+</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">Hiring Companies</div>
          </div>
          <div className="text-center border-r border-slate-100 last:border-r-0">
            <div className="text-3xl md:text-4xl font-extrabold text-indigo-600">45,000+</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">Candidates Hired</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-emerald-600">99.4%</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">Satisfaction Score</div>
          </div>
        </div>
      </section>

      {/* Role Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Built for Modern Recruitment</h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">
            A cohesive platform designed with tailored experiences for Candidates, Recruiters, and Admins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Candidate Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiBriefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Candidates</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Rich profile & validated resume uploads</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Advanced filtering: salary, experience, mode</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Real-time status tracking & notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Automated interview schedule sync</span>
              </li>
            </ul>
          </div>

          {/* Recruiter Card */}
          <div className="bg-white p-8 rounded-2xl border border-indigo-200 shadow-md relative hover:shadow-lg transition-shadow group">
            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Popular
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiUsers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Recruiters</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Comprehensive job publishing lifecycle</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Applicant pipeline: Review, Shortlist, Hire</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Built-in interview scheduling & links</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Hiring analytics & applicant conversion metrics</span>
              </li>
            </ul>
          </div>

          {/* Admin Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiShield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Platform Admins</h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Company verification & user moderation</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Scam & fake job report resolution</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>Review moderation & platform security</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                <span>System-wide health & analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
