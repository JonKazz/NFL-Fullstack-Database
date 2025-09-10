import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle API errors and redirect to appropriate error pages
 * @returns {Object} Object containing error handling functions
 */
export const useErrorHandler = () => {
  const navigate = useNavigate();

  /**
   * Handle API errors and redirect based on error type
   * @param {Error} error - The error object from API call
   * @param {Object} options - Configuration options
   * @param {boolean} options.showConsoleError - Whether to log error to console (default: true)
   */
  const handleApiError = (error, options = {}) => {
    const { showConsoleError = true } = options;

    if (showConsoleError) {
      console.error('API Error:', error);
    }

    // Check if it's a 404 error (resource not found)
    if (error.message.includes('404') || error.message.includes('not found')) {
      navigate('/404');
      return;
    }

    // Check if it's a 500 error (server error)
    if (error.message.includes('500') || error.message.includes('server error')) {
      navigate('/500');
      return;
    }

    // For other errors, you might want to show a toast notification
    // or redirect to a generic error page
    console.error('Unhandled API error:', error);
  };

  /**
   * Wrapper function for API calls that automatically handles errors
   * @param {Function} apiCall - The API function to call
   * @param {Object} options - Configuration options
   * @returns {Promise} Promise that resolves with API response or handles error
   */
  const safeApiCall = async (apiCall, options = {}) => {
    try {
      return await apiCall();
    } catch (error) {
      handleApiError(error, options);
      throw error; // Re-throw so component can handle if needed
    }
  };

  return {
    handleApiError,
    safeApiCall
  };
};

/**
 * Utility function to check if an error is a 404 error
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a 404 error
 */
export const is404Error = (error) => {
  return error.message.includes('404') || 
         error.message.includes('not found') ||
         error.message.includes('Failed to fetch');
};

/**
 * Utility function to check if an error is a server error (5xx)
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a server error
 */
export const isServerError = (error) => {
  return error.message.includes('500') || 
         error.message.includes('server error') ||
         error.message.includes('internal server error');
};
