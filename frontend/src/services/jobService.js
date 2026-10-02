import api from '../utils/api';

export const jobService = {
  /**
   * Fetch active job categories
   */
  async getCategories() {
    const response = await api.get('/jobs/categories/');
    return response.data;
  },

  /**
   * Fetch public jobs with search, filtering, and pagination params
   */
  async getJobs(params = {}) {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    });

    const response = await api.get('/jobs/', { params: cleanParams });
    return response.data;
  },

  /**
   * Fetch full job specifications by slug or numeric ID
   */
  async getJobDetail(slugOrId) {
    const response = await api.get(`/jobs/${slugOrId}/`);
    return response.data;
  },

  /**
   * Recruiter: fetch recruiter's own posted jobs with metrics
   */
  async getRecruiterJobs(params = {}) {
    const response = await api.get('/jobs/recruiter/my-jobs/', { params });
    return response.data;
  },

  /**
   * Recruiter: create a new job posting
   */
  async createJob(jobData) {
    const response = await api.post('/jobs/recruiter/create/', jobData);
    return response.data;
  },

  /**
   * Recruiter: update existing job posting
   */
  async updateJob(id, jobData) {
    const response = await api.patch(`/jobs/recruiter/${id}/`, jobData);
    return response.data;
  },

  /**
   * Recruiter: delete a job posting
   */
  async deleteJob(id) {
    const response = await api.delete(`/jobs/recruiter/${id}/`);
    return response.data;
  },

  /**
   * Recruiter: transition job lifecycle status (draft, published, closed)
   */
  async updateJobStatus(id, newStatus) {
    const response = await api.patch(`/jobs/recruiter/${id}/status/`, {
      status: newStatus,
    });
    return response.data;
  },
};

export default jobService;
