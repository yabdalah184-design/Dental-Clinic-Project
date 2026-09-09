import apiClient from './apiClient';

const AUTH_USER_KEY = 'clinic_auth_user';
const AUTH_TOKEN_KEY = 'clinic_auth_token';
const REGISTERED_USERS_KEY = 'clinic_registered_users';

function getRegisteredUsers() {
  const saved = localStorage.getItem(REGISTERED_USERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  const defaultUsers = [
    { id: 1, name: "Evaluation User", email: "user@elhuda.com", password: "user123", role: "user" },
    { id: 2, name: "System Administrator", email: "admin@elhuda.com", username: "admin", password: "admin123", role: "admin" }
  ];
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export const authService = {
  getCurrentUser() {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  async loginUser({ email, password }) {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data && res.data.user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data.user));
        localStorage.setItem(AUTH_TOKEN_KEY, res.data.token || 'mock_token_' + Date.now());
        return res.data.user;
      }
    } catch {
      // fallback
    }

    const users = getRegisteredUsers();
    const user = users.find(
      (u) => (u.email.toLowerCase() === email.toLowerCase() || u.username === email) && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password. Try user@elhuda.com / user123');
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem(AUTH_TOKEN_KEY, 'mock_jwt_token_user_' + Date.now());
    return safeUser;
  },

  async loginAdmin({ name, password, email }) {
    try {
      const res = await apiClient.post('/auth/admin-login', { name, password, email });
      if (res.data && res.data.user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data.user));
        localStorage.setItem(AUTH_TOKEN_KEY, res.data.token || 'mock_admin_token_' + Date.now());
        return res.data.user;
      }
    } catch {
      // fallback
    }

    // Default admin check or registered admin check
    const users = getRegisteredUsers();
    const adminUser = users.find(
      (u) =>
        u.role === 'admin' &&
        (u.username === name || u.name.toLowerCase() === name.toLowerCase() || (email && u.email === email)) &&
        u.password === password
    );

    // Also allow direct 'admin' / 'admin123'
    if (adminUser || (name.trim().toLowerCase() === 'admin' && password === 'admin123')) {
      const safeAdmin = {
        id: adminUser ? adminUser.id : 99,
        name: adminUser ? adminUser.name : 'Administrator',
        email: adminUser ? adminUser.email : 'admin@elhuda.com',
        role: 'admin'
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeAdmin));
      localStorage.setItem(AUTH_TOKEN_KEY, 'mock_jwt_token_admin_' + Date.now());
      return safeAdmin;
    }

    throw new Error('Invalid Admin credentials. Try admin / admin123');
  },

  async register({ name, email, password, phone }) {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password, phone });
      if (res.data && res.data.user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data.user));
        localStorage.setItem(AUTH_TOKEN_KEY, res.data.token || 'mock_token_' + Date.now());
        return res.data.user;
      }
    } catch {
      // fallback
    }

    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name,
      email,
      password,
      phone: phone || '',
      role: 'user'
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: 'user' };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem(AUTH_TOKEN_KEY, 'mock_jwt_token_user_' + Date.now());
    return safeUser;
  },

  logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
