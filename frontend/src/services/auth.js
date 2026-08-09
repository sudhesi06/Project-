// Simulated Mock Authentication Service for AI Study Planner

export const authService = {
  /**
   * Mock User Login
   */
  async login(email, password, rememberMe) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
          reject(new Error('Email or Username is required.'));
          return;
        }
        if (trimmedEmail.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }
        if (!password) {
          reject(new Error('Password is required.'));
          return;
        }
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters.'));
          return;
        }

        // Mock success scenario
        // In real backend, we'd make a fetch POST request here
        const user = {
          email: trimmedEmail,
          name: trimmedEmail.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${trimmedEmail}`
        };

        if (rememberMe) {
          localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('auth_user', JSON.stringify(user));
        }

        resolve(user);
      }, 1200); // simulate network lag
    });
  },

  /**
   * Mock User Registration
   */
  async signup(name, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
          reject(new Error('Full Name is required.'));
          return;
        }
        if (!trimmedEmail) {
          reject(new Error('Email address is required.'));
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }
        if (!password) {
          reject(new Error('Password is required.'));
          return;
        }
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters long.'));
          return;
        }

        // Mock success scenario
        const user = {
          email: trimmedEmail,
          name: trimmedName,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${trimmedEmail}`
        };

        // Auto log in after signup (not rememberMe by default)
        sessionStorage.setItem('auth_user', JSON.stringify(user));

        resolve(user);
      }, 1500);
    });
  },

  /**
   * Mock Forgot Password reset request
   */
  async forgotPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
          reject(new Error('Email address is required.'));
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }

        resolve({ message: `A password reset link has been sent to ${trimmedEmail}.` });
      }, 1000);
    });
  },

  /**
   * Get active logged in user from local or session storage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  /**
   * Log out active user
   */
  logout() {
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user');
  }
};
