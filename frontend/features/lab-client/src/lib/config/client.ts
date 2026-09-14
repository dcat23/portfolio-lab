import { ApiClient, ApiError, type ApiResponse } from '@next-feature/client';
import { BACKEND_API_URL } from './env';
import { logger } from '@next-feature/logging/server';

const log = logger.child({ module: 'lab-client' });

/**
 * Centralized API client configuration
 *
 * This file provides a single point to configure:
 * - Base API URL
 * - Request/response interceptors
 * - Default headers
 * - Authentication handling
 */

const apiClient = new ApiClient({
  baseURL: BACKEND_API_URL,
  enableRefreshToken: false,
  onUnauthorized: async () => {
    log.info('Unauthorized');
  },
  onAuthenticated: async (config) => {
    log.info(config.data, `${config.method.toUpperCase()} ${config.url}`);
  },

  maxRetries: 1,
});

/**
 * Example: Override request interceptor
 */
// apiClient.interceptors.request.use((config) => {
//   // Add custom headers, auth tokens, etc.
//   return config;
// });

/**
 * Example: Override response interceptor
 */
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally
//     return Promise.reject(error);
//   }
// );

// Re-export commonly used utilities
export { ApiError, type ApiResponse };

// Export configured API client for use in server actions
export default apiClient;
