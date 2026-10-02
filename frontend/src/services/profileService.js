import api from '../utils/api';

export const profileService = {
  /**
   * Fetch current candidate profile
   */
  async getCandidateProfile() {
    const response = await api.get('/users/profile/candidate/');
    return response.data;
  },

  /**
   * Update candidate headline, skills, socials, etc.
   */
  async updateCandidateProfile(data) {
    const response = await api.patch('/users/profile/candidate/', data);
    return response.data;
  },

  /**
   * Upload or replace PDF resume (multipart form)
   */
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/users/profile/candidate/resume/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete uploaded PDF resume
   */
  async deleteResume() {
    const response = await api.delete('/users/profile/candidate/resume/');
    return response.data;
  },

  /**
   * Experience CRUD
   */
  async addExperience(data) {
    const response = await api.post('/users/profile/experience/', data);
    return response.data;
  },

  async updateExperience(id, data) {
    const response = await api.patch(`/users/profile/experience/${id}/`, data);
    return response.data;
  },

  async deleteExperience(id) {
    const response = await api.delete(`/users/profile/experience/${id}/`);
    return response.data;
  },

  /**
   * Education CRUD
   */
  async addEducation(data) {
    const response = await api.post('/users/profile/education/', data);
    return response.data;
  },

  async updateEducation(id, data) {
    const response = await api.patch(`/users/profile/education/${id}/`, data);
    return response.data;
  },

  async deleteEducation(id) {
    const response = await api.delete(`/users/profile/education/${id}/`);
    return response.data;
  },

  /**
   * Certification CRUD
   */
  async addCertification(data) {
    const response = await api.post('/users/profile/certification/', data);
    return response.data;
  },

  async deleteCertification(id) {
    const response = await api.delete(`/users/profile/certification/${id}/`);
    return response.data;
  },
};

export default profileService;
