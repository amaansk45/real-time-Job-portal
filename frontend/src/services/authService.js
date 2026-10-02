import api from '../utils/api';

export const authService = {
  /**
   * Log in user with email and password
   */
  async login(email, password) {
    const response = await api.post('/users/login/', { email, password });
    return response.data;
  },

  /**
   * Register a new candidate or recruiter account
   */
  async register(data) {
    const response = await api.post('/users/register/', data);
    return response.data;
  },

  /**
   * Log out and blacklist refresh token
   */
  async logout(refreshToken) {
    try {
      if (refreshToken) {
        await api.post('/users/logout/', { refresh: refreshToken });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
    }
  },

  /**
   * Fetch current authenticated user profile
   */
  async getCurrentUser() {
    const response = await api.get('/users/me/');
    return response.data;
  },

  /**
   * Update authenticated user profile
   */
  async updateProfile(data) {
    const response = await api.patch('/users/me/', data);
    return response.data;
  },

  /**
   * Change current user's password
   */
  async changePassword(old_password, new_password, confirm_password) {
    const response = await api.post('/users/change-password/', {
      old_password,
      new_password,
      confirm_password,
    });
    return response.data;
  },

  /**
   * Request password reset link for forgotten account
   */
  async forgotPassword(email) {
    const response = await api.post('/users/forgot-password/', { email });
    return response.data;
  },

  /**
   * Reset account password with token
   */
  async resetPassword(uidb64, token, new_password, confirm_password) {
    const response = await api.post('/users/reset-password/', {
      uidb64,
      token,
      new_password,
      confirm_password,
    });
    return response.data;
  },

  /**
   * Confirm email address with token
   */
  async verifyEmail(uidb64, token) {
    const response = await api.post('/users/verify-email/', { uidb64, token });
    return response.data;
  },
};

export default authService;
