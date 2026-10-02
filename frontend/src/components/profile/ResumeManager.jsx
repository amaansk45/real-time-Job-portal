import React, { useState, useRef } from 'react';
import profileService from '../../services/profileService';
import Button from '../common/Button';
import Alert from '../common/Alert';
import {
  FiFileText,
  FiUploadCloud,
  FiDownload,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
} from 'react-icons/fi';

const ResumeManager = ({ resumeUrl, resumeName, updatedAt, onResumeChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileValidationAndUpload = async (file) => {
    setError('');
    setSuccess('');

    if (!file) return;

    // Validate PDF
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') {
      setError('Only PDF files (.pdf) are permitted.');
      return;
    }

    // Validate size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError('Resume file size must be less than 5 MB.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await profileService.uploadResume(file);
      setSuccess('Resume uploaded successfully!');
      if (onResumeChange) {
        onResumeChange(res.profile);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.resume?.[0] ||
        err.response?.data?.detail ||
        'Failed to upload resume. Please try again.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileValidationAndUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileValidationAndUpload(file);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your resume?')) return;

    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await profileService.deleteResume();
      setSuccess('Resume deleted successfully.');
      if (onResumeChange) {
        onResumeChange(null);
      }
    } catch (err) {
      setError('Failed to delete resume.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiFileText className="text-indigo-600 w-5 h-5" />
            Resume / CV
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload your verified PDF resume for one-click job applications
          </p>
        </div>
        {resumeName && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="w-3.5 h-3.5" />
            Verified PDF
          </span>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {resumeName ? (
        /* Active Resume Card */
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-100 font-bold text-xs uppercase">
              PDF
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                {resumeName}
              </h4>
              {updatedAt && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Updated {new Date(updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <FiDownload className="w-3.5 h-3.5" />
                Download
              </a>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isLoading}
              icon={FiRefreshCw}
            >
              Replace
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteResume}
              disabled={isLoading}
              icon={FiTrash2}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <FiUploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">
            Click to upload, or drag and drop your resume
          </h4>
          <p className="text-xs text-slate-500 mt-1">PDF format only (Max. 5MB)</p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              isLoading={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose PDF File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
