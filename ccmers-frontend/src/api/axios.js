const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiRequest = async (endpoint, method = 'GET', data = null, headers = {}) => {
  const token = localStorage.getItem('ccmers_token');
  
  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...headers
  };

  const config = {
    method,
    headers: authHeaders
  };

  if (data) {
    if (data instanceof FormData) {
      delete config.headers['Content-Type'];
      config.body = data;
    } else {
      config.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  } catch (error) {
    console.warn(`[API Network Call Failed: ${endpoint}] Fallback mode active.`, error.message);
    return { ok: false, error: error.message };
  }
};
