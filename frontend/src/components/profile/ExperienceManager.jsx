import React, { useState } from 'react';
import profileService from '../../services/profileService';
import Button from '../common/Button';
import InputField from '../common/InputField';
import Alert from '../common/Alert';
import {
  FiBriefcase,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiCheck,
} from 'react-icons/fi';

const ExperienceManager = ({ experiences = [], onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });

  const handleOpenAdd = () => {
    setSelectedExp(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    });
    setError('');
    setIsEditing(true);
  };

  const handleOpenEdit = (exp) => {
    setSelectedExp(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      description: exp.description || '',
    });
    setError('');
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.start_date) {
      setError('Job title, company, and start date are required.');
      return;
    }

    if (!formData.is_current && !formData.end_date) {
      setError('Please provide an end date or check "I currently work here".');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const payload = { ...formData };
      if (payload.is_current) {
        payload.end_date = null;
      }

      if (selectedExp) {
        await profileService.updateExperience(selectedExp.id, payload);
      } else {
        await profileService.addExperience(payload);
      }
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      const errMsg =
        err.response?.data?.end_date?.[0] ||
        err.response?.data?.detail ||
        'Failed to save experience.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await profileService.deleteExperience(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to delete experience.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiBriefcase className="text-indigo-600 w-5 h-5" />
            Work Experience
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Highlight your career milestones and impact
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAdd}
            icon={FiPlus}
          >
            Add Experience
          </Button>
        )}
      </div>

      {/* Editing Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <h4 className="font-semibold text-sm text-slate-900">
            {selectedExp ? 'Edit Experience' : 'Add Work Experience'}
          </h4>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Job Title"
              placeholder="e.g. Senior Backend Developer"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <InputField
              label="Company Name"
              placeholder="e.g. Acme Tech Inc."
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <InputField
            label="Location"
            placeholder="e.g. Bangalore, India (or 'Remote')"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Start Date"
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <InputField
              label="End Date"
              type="date"
              disabled={formData.is_current}
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_current}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_current: e.target.checked,
                  end_date: e.target.checked ? '' : formData.end_date,
                })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 font-medium">I currently work in this role</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description & Achievements
            </label>
            <textarea
              rows={3}
              placeholder="Key responsibilities, technologies utilized, and measurable accomplishments..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
            >
              Save Experience
            </Button>
          </div>
        </form>
      )}

      {/* Experience Timeline */}
      <div className="space-y-4 pt-2">
        {experiences.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No work experience listed yet.</p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-900">{exp.title}</h4>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-indigo-600 font-medium">{exp.company}</span>
                  {exp.is_current && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5" />
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(exp)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienceManager;
