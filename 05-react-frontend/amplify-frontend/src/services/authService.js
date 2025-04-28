import { Auth } from 'aws-amplify';

/**
 * Service for authentication-related functionality
 */
class AuthService {
  /**
   * Get the current authenticated user
   * @returns {Promise<Object>} - User object
   */
  async getCurrentUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  /**
   * Get the current session including tokens
   * @returns {Promise<Object>} - Session object
   */
  async getCurrentSession() {
    try {
      const session = await Auth.currentSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }
  
  /**
   * Get JWT token for the current user
   * @returns {Promise<string>} - JWT token
   */
  async getJwtToken() {
    try {
      const session = await Auth.currentSession();
      return session.getIdToken().getJwtToken();
    } catch (error) {
      console.error('Error getting JWT token:', error);
      return null;
    }
  }
  
  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
  
  /**
   * Update user attributes
   * @param {Object} attributes - User attributes to update
   * @returns {Promise<Object>} - Updated user
   */
  async updateUserAttributes(attributes) {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const result = await Auth.updateUserAttributes(user, attributes);
      return result;
    } catch (error) {
      console.error('Error updating user attributes:', error);
      throw error;
    }
  }
  
  /**
   * Change password for the current user
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<string>} - Result
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const result = await Auth.changePassword(user, oldPassword, newPassword);
      return result;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
  
  /**
   * Check if the user has MFA enabled
   * @returns {Promise<boolean>} - True if MFA is enabled
   */
  async isMfaEnabled() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const preferences = await Auth.getUserData(user);
      return preferences.PreferredMfaSetting ? true : false;
    } catch (error) {
      console.error('Error checking MFA status:', error);
      return false;
    }
  }
}

export default new AuthService();