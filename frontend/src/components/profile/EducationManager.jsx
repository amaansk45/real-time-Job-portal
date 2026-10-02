import React, { useState } from 'react';
import profileService from '../../services/profileService';
import Button from '../common/Button';
import InputField from '../common/InputField';
import Alert from '../common/Alert';
import { FiBookOpen, FiPlus, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

const EducationManager = ({ educations = [], onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    field_of_study: '',
    start_year: '',
    end_year: '',
    grade: '',
  });

  const handleOpenAdd = () => {
    setSelectedEdu(null);
    setFormData({
      degree: '',
      institution: '',
      field_of_study: '',
      start_year: '',
      end_year: '',
      grade: '',
    });
    setError('');
    setIsEditing(true);
  };

  const handleOpenEdit = (edu) => {
    setSelectedEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      field_of_study: edu.field_of_study || '',
      start_year: edu.start_year,
      end_year: edu.end_year || '',
      grade: edu.grade || '',
    });
    setError('');
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.degree || !formData.institution || !formData.start_year) {
      setError('Degree, institution, and start year are required.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        start_year: parseInt(formData.start_year),
        end_year: formData.end_year ? parseInt(formData.end_year) : null,
      };

      if (selectedEdu) {
        await profileService.updateEducation(selectedEdu.id, payload);
      } else {
        await profileService.addEducation(payload);
      }
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      const errMsg =
        err.response?.data?.end_year?.[0] ||
        err.response?.data?.detail ||
        'Failed to save education.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await profileService.deleteEducation(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to delete education.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiBookOpen className="text-indigo-600 w-5 h-5" />
            Education & Academics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your university degrees, diplomas, or certifications
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAdd}
            icon={FiPlus}
          >
            Add Education
          </Button>
        )}
      </div>

      {/* Editing Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <h4 className="font-semibold text-sm text-slate-900">
            {selectedEdu ? 'Edit Education' : 'Add Education'}
          </h4>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Degree / Diploma"
              placeholder="e.g. Bachelor of Technology"
              required
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            />
            <InputField
              label="Institution / University"
              placeholder="e.g. Stanford University"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Field of Study"
              placeholder="e.g. Computer Science"
              value={formData.field_of_study}
              onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
            />
            <InputField
              label="Start Year"
              type="number"
              placeholder="2018"
              required
              value={formData.start_year}
              onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
            />
            <InputField
              label="End Year (or Expected)"
              type="number"
              placeholder="2022"
              value={formData.end_year}
              onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
            />
          </div>

          <InputField
            label="Grade / GPA (Optional)"
            placeholder="e.g. 3.8 GPA or First Class with Distinction"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          />

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
              Save Education
            </Button>
          </div>
        </form>
      )}

      {/* Education List */}
      <div className="space-y-4 pt-2">
        {educations.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No education listed yet.</p>
        ) : (
          educations.map((edu) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-900">{edu.degree}</h4>
                  {edu.field_of_study && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-700">{edu.field_of_study}</span>
                    </>
                  )}
                </div>

                <p className="text-xs font-medium text-indigo-600">{edu.institution}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5" />
                    {edu.start_year} — {edu.end_year || 'Present'}
                  </span>
                  {edu.grade && <span>Grade: {edu.grade}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(edu)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(edu.id)}
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

export default EducationManager;
