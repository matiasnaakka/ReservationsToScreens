// Create a new utility file for centralized API request handling

import { navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * Makes an authenticated API request
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('roomsmanagement_token');
  
  // Set up headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_APP_API_KEY,
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (response.status === 401) {
    // Clear token and redirect to login
    localStorage.removeItem('roomsmanagement_token');
    window.location.href = '/';
    throw new Error('Authentication expired. Please login again.');
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};
