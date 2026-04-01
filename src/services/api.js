const API_BASE_URL = 'http://localhost:5000/api';

// Store token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check if the backend is running on port 5000.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(response.token);
    return response;
  },

  login: async (credentials) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async () => {
    return await apiCall('/transactions');
  },

  create: async (transactionData) => {
    return await apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Budgets API
export const budgetsAPI = {
  getAll: async () => {
    return await apiCall('/budgets');
  },

  create: async (budgetData) => {
    return await apiCall('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  },

  update: async (id, budgetData) => {
    return await apiCall(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
  },
};

// Goals API
export const goalsAPI = {
  getAll: async () => {
    return await apiCall('/goals');
  },

  create: async (goalData) => {
    return await apiCall('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  },

  update: async (id, goalData) => {
    return await apiCall(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  },
};

// Reminders API
export const remindersAPI = {
  getAll: async () => {
    return await apiCall('/reminders');
  },

  create: async (reminderData) => {
    return await apiCall('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },

  update: async (id, reminderData) => {
    return await apiCall(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reminderData),
    });
  },
};

// Shared Expenses API
export const sharedExpensesAPI = {
  getAll: async () => {
    return await apiCall('/shared-expenses');
  },

  create: async (sharedExpenseData) => {
    return await apiCall('/shared-expenses', {
      method: 'POST',
      body: JSON.stringify(sharedExpenseData),
    });
  },

  update: async (id, sharedExpenseData) => {
    return await apiCall(`/shared-expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sharedExpenseData),
    });
  },
};

// Data Export/Import API
export const dataAPI = {
  export: async () => {
    return await apiCall('/export');
  },

  import: async (importData) => {
    return await apiCall('/import', {
      method: 'POST',
      body: JSON.stringify(importData),
    });
  },
};

export default {
  authAPI,
  transactionsAPI,
  budgetsAPI,
  goalsAPI,
  remindersAPI,
  sharedExpensesAPI,
  dataAPI,
};
