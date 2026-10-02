import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import authService from '../../services/authService';
import ResumeManager from '../../components/profile/ResumeManager';
import SkillsManager from '../../components/profile/SkillsManager';
import ExperienceManager from '../../components/profile/ExperienceManager';
import EducationManager from '../../components/profile/EducationManager';
import SocialLinksManager from '../../components/profile/SocialLinksManager';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Alert from '../../components/common/Alert';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit3,
  FiCheckCircle,
  FiAward,
} from 'react-icons/fi';

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [userFormData, setUserFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: '',
  });

  const [headline, setHeadline] = useState('');

  const fetchProfileData = async () => {
    try {
      const data = await profileService.getCandidateProfile();
      setProfile(data);
      setHeadline(data.headline || '');
      if (data.user) {
        setUserFormData({
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          bio: data.user.bio || '',
        });
      }
    } catch (err) {
      console.error('Failed to load candidate profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Calculate profile completeness score
  const calculateCompleteness = () => {
    let score = 20; // registered user baseline
    if (user?.first_name && user?.last_name) score += 10;
    if (user?.bio || profile?.headline) score += 15;
    if (profile?.resume) score += 25;
    if (profile?.skills?.length > 0) score += 10;
    if (profile?.experiences?.length > 0) score += 10;
    if (profile?.educations?.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleSaveUserInfo = async (e) => {
    e.preventDefault();
    setIsSavingUser(true);
    setFeedback(null);
    try {
      const updatedUser = await authService.updateProfile(userFormData);
      updateUser(updatedUser);

      if (headline !== profile?.headline) {
        const updatedProfile = await profileService.updateCandidateProfile({ headline });
        setProfile(updatedProfile);
      }

      setIsEditingUser(false);
      setFeedback({ type: 'success', message: 'Profile details updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to update personal information.' });
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleSkillsChange = async (newSkills) => {
    try {
      const updated = await profileService.updateCandidateProfile({ skills: newSkills });
      setProfile(updated);
    } catch (err) {
      console.error('Failed to update skills', err);
    }
  };

  const handleSocialSave = async (data) => {
    const updated = await profileService.updateCandidateProfile(data);
    setProfile(updated);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 text-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium text-slate-500">Loading your candidate profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-indigo-200 flex-shrink-0">
              {user?.first_name ? user.first_name[0].toUpperCase() : 'C'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {user?.first_name} {user?.last_name || 'Candidate'}
                </h1>
                {user?.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-indigo-600">
                {profile?.headline || 'No headline specified yet'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5" />
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <FiPhone className="w-3.5 h-3.5" />
                    {user?.phone}
                  </span>
                )}
                {user?.location && (
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5" />
                    {user?.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingUser(!isEditingUser)}
            icon={FiEdit3}
          >
            {isEditingUser ? 'Close Form' : 'Edit Profile'}
          </Button>
        </div>

        {/* Bio */}
        {user?.bio && !isEditingUser && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              About Me
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {user.bio}
            </p>
          </div>
        )}

        {/* Edit User Info Form */}
        {isEditingUser && (
          <form onSubmit={handleSaveUserInfo} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <h3 className="font-semibold text-sm text-slate-900">Personal Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                required
                value={userFormData.first_name}
                onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
              />
              <InputField
                label="Last Name"
                required
                value={userFormData.last_name}
                onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
              />
            </div>

            <InputField
              label="Professional Headline"
              placeholder="e.g. Senior Frontend Developer | React, Tailwind & Next.js"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              helperText="Brief summary visible to hiring managers"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Phone Number"
                type="tel"
                value={userFormData.phone}
                onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
              />
              <InputField
                label="Current Location"
                placeholder="e.g. Mumbai, India (or Remote)"
                value={userFormData.location}
                onChange={(e) => setUserFormData({ ...userFormData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bio / Summary
              </label>
              <textarea
                rows={3}
                placeholder="Share your background, passions, and core expertise..."
                value={userFormData.bio}
                onChange={(e) => setUserFormData({ ...userFormData, bio: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsEditingUser(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSavingUser}>
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Profile Completeness Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <FiAward className="text-indigo-600 w-4 h-4" />
              Profile Completeness
            </span>
            <span className="text-indigo-600 font-bold">{completeness}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <ResumeManager
        resumeUrl={profile?.resume_url}
        resumeName={profile?.resume_name}
        updatedAt={profile?.resume_updated_at}
        onResumeChange={(updatedProfile) => {
          if (updatedProfile) {
            setProfile(updatedProfile);
          } else {
            setProfile((prev) => ({
              ...prev,
              resume: null,
              resume_name: '',
              resume_url: null,
            }));
          }
        }}
      />

      {/* Skills Section */}
      <SkillsManager
        skills={profile?.skills || []}
        onSkillsChange={handleSkillsChange}
      />

      {/* Work Experience Section */}
      <ExperienceManager
        experiences={profile?.experiences || []}
        onRefresh={fetchProfileData}
      />

      {/* Education Section */}
      <EducationManager
        educations={profile?.educations || []}
        onRefresh={fetchProfileData}
      />

      {/* Social Links & Preferences */}
      <SocialLinksManager
        linkedinUrl={profile?.linkedin_url}
        githubUrl={profile?.github_url}
        portfolioUrl={profile?.portfolio_url}
        yearsOfExperience={profile?.years_of_experience}
        expectedSalary={profile?.expected_salary}
        onSave={handleSocialSave}
      />
    </div>
  );
};

export default CandidateProfile;
