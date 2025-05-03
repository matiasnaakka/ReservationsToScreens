/**
 * API Configuration
 *
 * This file contains the configuration for the API, including the base URL and API key.
 * The configuration is exported as `API_CONFIG` and can be imported and used in other parts of the application.
 *
 * @example
 * import { API_CONFIG } from '../config/api.config';
 * const apiUrl = API_CONFIG.BASE_URL;
 * const apiKey = API_CONFIG.API_KEY;
 */

interface ApiConfig {
  BASE_URL: string;
  API_KEY: string;
  DEV_URL: string;
}

export const API_CONFIG: ApiConfig = {
  API_KEY: import.meta.env.VITE_APP_API_KEY || '',
  BASE_URL: import.meta.env.DEV
    ? 'http://localhost:3000/'
    : import.meta.env.VITE_APP_URL_PATH || '',

  DEV_URL: 'http://localhost:3002/'
};
