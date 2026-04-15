const API_BASE_URL = 'https://api.vivifysoft.in/crm/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401 && !endpoint.toLowerCase().includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return null;
    }

    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.isBackendError = true;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export const authApi = {
  login: (credentials) => apiRequest('/Auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (data) => apiRequest('/Auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const superAdminApi = {
  getOrganizations: () => apiRequest('/SuperAdmin/organizations', { method: 'GET' }),
};

export default apiRequest;
