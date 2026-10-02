import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Home from './pages/Home';

// Placeholder pages for setup verification
const PlaceholderPage = ({ title, subtitle }) => (
  <div className="max-w-4xl mx-auto py-24 px-4 text-center">
    <div className="inline-block p-4 rounded-full bg-indigo-50 text-indigo-600 mb-4">
      <span className="text-2xl font-bold">🚀</span>
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{title}</h1>
    <p className="text-slate-600 mb-6">{subtitle || 'This module will be connected in upcoming feature branches.'}</p>
    <Link to="/" className="gradient-btn px-6 py-2.5 rounded-xl font-medium inline-block">
      Back to Home
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/jobs"
                element={<PlaceholderPage title="Job Search & Exploration" subtitle="Search by title, location, salary, experience, work mode and skills." />}
              />
              <Route
                path="/companies"
                element={<PlaceholderPage title="Top Companies" subtitle="Discover verified company profiles, culture reviews, and active openings." />}
              />
              <Route
                path="/login"
                element={<PlaceholderPage title="Sign In" subtitle="Candidate and Recruiter authentication with secure JWT tokens." />}
              />
              <Route
                path="/register"
                element={<PlaceholderPage title="Create an Account" subtitle="Join JobConnect as a Job Candidate or Hiring Recruiter." />}
              />
              <Route
                path="/candidate/dashboard"
                element={<PlaceholderPage title="Candidate Dashboard" subtitle="Manage your profile, resumes, applications, and scheduled interviews." />}
              />
              <Route
                path="/recruiter/dashboard"
                element={<PlaceholderPage title="Recruiter Hub" subtitle="Post jobs, screen applicants, shortlist candidates, and coordinate interviews." />}
              />
              <Route
                path="/admin/dashboard"
                element={<PlaceholderPage title="Admin Portal" subtitle="Moderate companies, jobs, reports, reviews, and platform analytics." />}
              />
              <Route
                path="*"
                element={<PlaceholderPage title="Page Not Found" subtitle="The requested page could not be located." />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
