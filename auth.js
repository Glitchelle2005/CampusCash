(function () {
  const USERS_STORAGE_KEY = 'campuscash_users';
  const CURRENT_USER_KEY = 'campuscash_current_user';

  const formMessage = function (element, message, kind) {
    if (!element) return;
    element.textContent = message;
    element.className = `auth-message ${kind || ''}`;
    element.hidden = !message;
  };

  const showPasswordToggles = function () {
    document.querySelectorAll('[data-toggle-password]').forEach(function (button) {
      button.addEventListener('click', function () {
        const input = document.getElementById(button.dataset.togglePassword);
        if (!input) return;
        const reveal = input.type === 'password';
        input.type = reveal ? 'text' : 'password';
        button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
        button.innerHTML = `<i class="fa-regular ${reveal ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
      });
    });
  };

  const hashPassword = async function (password) {
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (_) {
      let hash = 0;
      for (let i = 0; i < password.length; i++) {
        hash = ((hash << 5) - hash) + password.charCodeAt(i);
        hash |= 0;
      }
      return 'h_' + hash;
    }
  };

  const getUsers = function () {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (_) {}
    return [];
  };

  const saveUsers = function (users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const findUser = function (users, nameOrUsername) {
    if (!nameOrUsername) return null;
    const query = nameOrUsername.trim().toLowerCase();
    return users.find(u => {
      const uName = (u.username || '').toLowerCase();
      const fName = (u.fullName || '').toLowerCase();
      return uName === query || fName === query || fName.split(' ')[0] === query;
    });
  };

  const verifyPassword = async function (user, password) {
    if (user.password && user.password === password) return true;
    const hashed = await hashPassword(password);
    return user.passwordHash === hashed;
  };

  document.addEventListener('DOMContentLoaded', function () {
    showPasswordToggles();

    // Check if user is already logged in
    const existingSession = sessionStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
    if (existingSession) {
      try {
        const parsed = JSON.parse(existingSession);
        if (parsed?.id) {
          window.location.replace('dashboard.html');
          return;
        }
      } catch (_) {}
    }

    const form = document.querySelector('[data-auth-form]');
    const message = document.getElementById('authMessage');
    const resetForm = document.getElementById('resetPasswordForm');
    const forgotPasswordBtn = document.getElementById('forgotPassword');
    const cancelResetBtn = document.getElementById('cancelReset');

    if (forgotPasswordBtn && resetForm && form) {
      forgotPasswordBtn.addEventListener('click', function () {
        formMessage(message, '', '');
        form.hidden = true;
        resetForm.hidden = false;
        const usernameVal = document.getElementById('username')?.value.trim();
        const resetUsernameInput = document.getElementById('resetUsername');
        if (resetUsernameInput && usernameVal) {
          resetUsernameInput.value = usernameVal;
        }
      });
    }

    if (cancelResetBtn && resetForm && form) {
      cancelResetBtn.addEventListener('click', function () {
        formMessage(message, '', '');
        resetForm.hidden = true;
        form.hidden = false;
      });
    }

    if (resetForm) {
      resetForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        formMessage(message, '', '');
        const resetUsername = document.getElementById('resetUsername')?.value.trim();
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

        if (!resetUsername || !newPassword || !confirmNewPassword) {
          formMessage(message, 'Please complete all fields.', 'error');
          return;
        }
        if (newPassword.length < 4) {
          formMessage(message, 'Password must be at least 4 characters.', 'error');
          return;
        }
        if (newPassword !== confirmNewPassword) {
          formMessage(message, 'Passwords do not match.', 'error');
          return;
        }

        const users = getUsers();
        const user = findUser(users, resetUsername);
        if (!user) {
          formMessage(message, `No account found for "${resetUsername}".`, 'error');
          return;
        }

        user.passwordHash = await hashPassword(newPassword);
        delete user.password;
        saveUsers(users);

        formMessage(message, 'Password updated successfully! You can now log in.', 'success');
        resetForm.hidden = true;
        if (form) form.hidden = false;
        const pwdInput = document.getElementById('password');
        if (pwdInput) pwdInput.value = '';
      });
    }

    if (!form) return;
    const type = form.dataset.authForm;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      formMessage(message, '', '');

      const submit = form.querySelector('[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.dataset.originalText = submit.innerHTML;
        submit.textContent = type === 'register' ? 'Creating account…' : 'Signing in…';
      }

      try {
        const users = getUsers();

        if (type === 'register') {
          const fullName = document.getElementById('fullName').value.trim();
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;

          if (!fullName || !password || !confirmPassword) {
            throw new Error('Please enter your name and password.');
          }
          if (fullName.length < 2 || fullName.length > 120) {
            throw new Error('Name must be between 2 and 120 characters.');
          }
          if (password.length < 4) {
            throw new Error('Password must be at least 4 characters.');
          }
          if (password !== confirmPassword) {
            throw new Error('Passwords do not match.');
          }

          const existing = findUser(users, fullName);
          if (existing) {
            throw new Error(`An account with the name "${fullName}" already exists. Please log in.`);
          }

          const newUser = {
            id: 'usr_' + Date.now(),
            fullName: fullName,
            username: fullName.toLowerCase().replace(/\s+/g, ''),
            passwordHash: await hashPassword(password),
            createdAt: new Date().toISOString()
          };

          users.push(newUser);
          saveUsers(users);

          // Auto-login new user
          const sessionData = JSON.stringify({
            id: newUser.id,
            fullName: newUser.fullName,
            username: newUser.username
          });
          localStorage.setItem(CURRENT_USER_KEY, sessionData);

          formMessage(message, 'Account created! Loading your dashboard…', 'success');
          window.setTimeout(() => window.location.replace('dashboard.html'), 500);
        } else {
          // Login
          const usernameInput = document.getElementById('username').value.trim();
          const password = document.getElementById('password').value;

          if (!usernameInput || !password) {
            throw new Error('Enter your name and password to log in.');
          }

          let user = findUser(users, usernameInput);

          // If no user found and no users in storage yet, create a default user profile
          if (!user && users.length === 0) {
            user = {
              id: 'usr_' + Date.now(),
              fullName: usernameInput,
              username: usernameInput.toLowerCase().replace(/\s+/g, ''),
              passwordHash: await hashPassword(password),
              createdAt: new Date().toISOString()
            };
            users.push(user);
            saveUsers(users);
          }

          if (!user) {
            throw new Error(`No account found for "${usernameInput}". Click "Create an account" below to register.`);
          }

          const isValid = await verifyPassword(user, password);
          if (!isValid) {
            throw new Error('Incorrect password. Please try again or reset your password.');
          }

          const remember = document.getElementById('rememberMe')?.checked ?? true;
          const sessionData = JSON.stringify({
            id: user.id,
            fullName: user.fullName,
            username: user.username
          });

          if (remember) {
            localStorage.setItem(CURRENT_USER_KEY, sessionData);
            sessionStorage.removeItem(CURRENT_USER_KEY);
          } else {
            sessionStorage.setItem(CURRENT_USER_KEY, sessionData);
            localStorage.removeItem(CURRENT_USER_KEY);
          }

          formMessage(message, 'Signed in successfully! Loading dashboard…', 'success');
          window.setTimeout(() => window.location.replace('dashboard.html'), 400);
        }
      } catch (error) {
        formMessage(message, error.message || 'Authentication failed. Please try again.', 'error');
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.innerHTML = submit.dataset.originalText || (type === 'register' ? 'Create account' : 'Log in');
        }
      }
    });
  });
})();
