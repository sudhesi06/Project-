// Enhanced Mock Authentication Service for AI Study Planner

const DEFAULT_USERS = [
  {
    id: 'user_1',
    email: 'alex@university.edu',
    password: 'password123',
    name: 'Alex Morgan',
    major: 'Computer Science & AI',
    dailyGoal: 4,
    bio: '3rd year Computer Science student focusing on Machine Learning & Algorithms.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
    memberSince: '2025'
  },
  {
    id: 'user_2',
    email: 'student@demo.com',
    password: 'password123',
    name: 'Demo Student',
    major: 'Software Engineering',
    dailyGoal: 3,
    bio: 'Passionate full-stack developer preparing for semester finals.',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Demo',
    memberSince: '2026'
  }
];

function getRegisteredUsers() {
  const usersStr = localStorage.getItem('registered_users');
  if (!usersStr) {
    localStorage.setItem('registered_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(usersStr);
  } catch (e) {
    localStorage.setItem('registered_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('registered_users', JSON.stringify(users));
}

export const authService = {
  /**
   * Mock User Login with strict credential verification against user registry
   */
  async login(emailOrUsername, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const query = emailOrUsername.trim().toLowerCase();
        if (!query) {
          reject(new Error('Email or Username is required.'));
          return;
        }
        if (!password) {
          reject(new Error('Password is required.'));
          return;
        }

        const users = getRegisteredUsers();
        // Match either email or username prefix before @
        const matchedUser = users.find(u => 
          (u.email.toLowerCase() === query || u.email.split('@')[0].toLowerCase() === query) &&
          u.password === password
        );

        if (!matchedUser) {
          reject(new Error('Invalid email/username or password. Please check your credentials and try again.'));
          return;
        }

        // Exclude password from active session payload
        const { password: _, ...userSessionPayload } = matchedUser;

        if (rememberMe) {
          localStorage.setItem('auth_user', JSON.stringify(userSessionPayload));
        } else {
          sessionStorage.setItem('auth_user', JSON.stringify(userSessionPayload));
        }

        resolve(userSessionPayload);
      }, 800);
    });
  },

  /**
   * Mock User Registration with duplicate account prevention
   */
  async signup(name, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

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
        if (!password || password.length < 6) {
          reject(new Error('Password must be at least 6 characters long.'));
          return;
        }

        const users = getRegisteredUsers();
        const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);

        if (existing) {
          reject(new Error('An account with this email address already exists. Please sign in instead.'));
          return;
        }

        const newUser = {
          id: `user_${Date.now()}`,
          name: trimmedName,
          email: trimmedEmail,
          password: password,
          major: 'General Computer Science',
          dailyGoal: 4,
          bio: 'Student at AI Study Planner.',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(trimmedName)}`,
          memberSince: new Date().getFullYear().toString()
        };

        users.push(newUser);
        saveRegisteredUsers(users);

        const { password: _, ...userSessionPayload } = newUser;
        // Auto sign in user into sessionStorage
        sessionStorage.setItem('auth_user', JSON.stringify(userSessionPayload));

        resolve(userSessionPayload);
      }, 1000);
    });
  },

  /**
   * Update active user profile
   */
  async updateProfile(updatedData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          reject(new Error('No active authenticated session found.'));
          return;
        }

        const users = getRegisteredUsers();
        const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());

        const mergedUser = {
          ...currentUser,
          ...updatedData
        };

        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            ...updatedData
          };
          saveRegisteredUsers(users);
        }

        // Update active storage
        if (localStorage.getItem('auth_user')) {
          localStorage.setItem('auth_user', JSON.stringify(mergedUser));
        } else {
          sessionStorage.setItem('auth_user', JSON.stringify(mergedUser));
        }

        resolve(mergedUser);
      }, 600);
    });
  },

  /**
   * Mock Forgot Password reset request
   */
  async forgotPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) {
          reject(new Error('Email address is required.'));
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }

        const users = getRegisteredUsers();
        const exists = users.some(u => u.email.toLowerCase() === trimmedEmail);

        if (!exists) {
          reject(new Error('No account found with this email address.'));
          return;
        }

        resolve({ message: `Password reset instructions have been sent to ${trimmedEmail}.` });
      }, 800);
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
