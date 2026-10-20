const USERS_KEY = 'smart-isl-users';
const SESSION_KEY = 'smart-isl-session';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const authService = {
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  },

  signUp({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const user = { name: name.trim(), email: normalizedEmail, password };
    saveUsers([...users, user]);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
    return { name: user.name, email: user.email };
  },

  login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = getUsers().find((item) => item.email === normalizedEmail && item.password === password);

    if (!user) {
      throw new Error('Email or password is incorrect.');
    }

    const session = { name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  resetPassword(email) {
    const exists = getUsers().some((user) => user.email === email.trim().toLowerCase());
    if (!exists) {
      throw new Error('No account was found with that email.');
    }
  }
};
