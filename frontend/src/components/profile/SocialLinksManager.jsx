import React, { useState } from 'react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { FiLinkedin, FiGithub, FiGlobe, FiDollarSign, FiClock, FiLink } from 'react-icons/fi';

const SocialLinksManager = ({
  linkedinUrl = '',
  githubUrl = '',
  portfolioUrl = '',
  yearsOfExperience = 0,
  expectedSalary = '',
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    linkedin_url: linkedinUrl,
    github_url: githubUrl,
    portfolio_url: portfolioUrl,
    years_of_experience: yearsOfExperience,
    expected_salary: expectedSalary || '',
  });

  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      await onSave(formData);
      setFeedback({ type: 'success', message: 'Links and preferences updated!' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to update links.' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FiLink className="text-indigo-600 w-5 h-5" />
          Online Presence & Preferences
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your GitHub, LinkedIn, and personal portfolio to showcase real projects
        </p>
      </div>

      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="LinkedIn URL"
            type="url"
            placeholder="https://linkedin.com/in/username"
            icon={FiLinkedin}
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
          />

          <InputField
            label="GitHub URL"
            type="url"
            placeholder="https://github.com/username"
            icon={FiGithub}
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
          />

          <InputField
            label="Portfolio Website"
            type="url"
            placeholder="https://yourname.dev"
            icon={FiGlobe}
            value={formData.portfolio_url}
            onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <InputField
            label="Years of Experience"
            type="number"
            min="0"
            placeholder="e.g. 3"
            icon={FiClock}
            value={formData.years_of_experience}
            onChange={(e) =>
              setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })
            }
          />

          <InputField
            label="Expected Annual Salary ($ or ₹)"
            type="number"
            placeholder="e.g. 85000"
            icon={FiDollarSign}
            value={formData.expected_salary}
            onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SocialLinksManager;
