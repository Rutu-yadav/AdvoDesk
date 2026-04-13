import api from "./api";
import { STORAGE_KEYS } from "../utils/constants";

/**
 * Authentication service
 */
const authService = {
  /**
   * Login user
   */
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
    }
    return response.data;
  },

  /**
   * Register user
   */
  register: async (userData) => {
    // Create FormData for multipart/form-data submission
    const formData = new FormData();

    // Append all user data fields
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    formData.append("email", userData.email);
    formData.append("fullName", userData.fullName);
    formData.append("role", userData.role);

    if (userData.phone) {
      formData.append("phone", userData.phone);
    }
    if (userData.address) {
      formData.append("address", userData.address);
    }
    if (userData.city) {
      formData.append("city", userData.city);
    }
    if (userData.state) {
      formData.append("state", userData.state);
    }
    if (userData.pincode) {
      formData.append("pincode", userData.pincode);
    }

    // Append advocate-specific fields if present
    if (userData.enrollmentNumber) {
      formData.append("enrollmentNumber", userData.enrollmentNumber);
    }

    if (userData.enrollmentDocument) {
      formData.append("enrollmentDocument", userData.enrollmentDocument);
    }

    // Append client-specific document and photo fields
    if (userData.profilePhoto) {
      formData.append("profilePhoto", userData.profilePhoto);
    }
    if (userData.aadharDocument) {
      formData.append("aadharDocument", userData.aadharDocument);
    }
    if (userData.panDocument) {
      formData.append("panDocument", userData.panDocument);
    }

    const response = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};

export default authService;
