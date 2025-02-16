export const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message;
  } else if (error.request) {
    // No response received
    return 'Network error. Please check your connection.';
  } else {
    // Request setup error
    return 'An error occurred. Please try again.';
  }
}; 