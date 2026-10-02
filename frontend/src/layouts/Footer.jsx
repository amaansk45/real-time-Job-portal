import React from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <FiBriefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Job<span className="text-indigo-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering candidates and top employers with seamless job discovery, real-time tracking, and automated interview management.
            </p>
            <div className="flex space-x-3 text-slate-400">
              <a href="#" className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <FiGithub className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <FiTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-indigo-400 transition-colors">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-indigo-400 transition-colors">Explore Companies</Link>
              </li>
              <li>
                <Link to="/candidate/dashboard" className="hover:text-indigo-400 transition-colors">Candidate Dashboard</Link>
              </li>
              <li>
                <Link to="/candidate/profile" className="hover:text-indigo-400 transition-colors">Resume & Profile</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recruiters</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/recruiter/jobs/create" className="hover:text-indigo-400 transition-colors">Post a Job</Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-indigo-400 transition-colors">Applicant Tracking</Link>
              </li>
              <li>
                <Link to="/recruiter/interviews" className="hover:text-indigo-400 transition-colors">Schedule Interviews</Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="hover:text-indigo-400 transition-colors">Company Branding</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="http://localhost:8000/api/docs/" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                  API Docs (Swagger)
                </a>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-indigo-400 transition-colors">Support & Feedback</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobConnect Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Crafted with Django REST Framework, React & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
