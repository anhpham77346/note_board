// API utility functions for making authenticated requests

// Get the API base URL from environment variables or use default
export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

// Get the authentication token from local storage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Make an authenticated API request
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers);
  
  // Set default content type if not already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add authorization header if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${getApiUrl()}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-2xx responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  // Return JSON response or empty object if no content
  return response.status !== 204 ? await response.json() : ({} as T);
};

// Convenience methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data: any, options: RequestInit = {}) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any, options: RequestInit = {}) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string, options: RequestInit = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}; 