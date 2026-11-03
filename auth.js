(function () {
  const clientFor = function (storageName) {
    if (!window.campusCashSupabase) {
      window.campusCashSupabase = window.createCampusCashClient(storageName);
    }
    return window.campusCashSupabase;
  };

  const formMessage = function (element, message, kind) {
    element.textContent = message;
    element.className = `auth-message ${kind || ''}`;
    element.hidden = !message;
  };

  const showPasswordToggles = function () {
    document.querySelectorAll('[data-toggle-password]').forEach(function (button) {
      button.addEventListener('click', function () {
        const input = document.getElementById(button.dataset.togglePassword);
        const reveal = input.type === 'password';
        input.type = reveal ? 'text' : 'password';
        button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
        button.innerHTML = `<i class="fa-regular ${reveal ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
      });
    });
  };

  document.addEventListener('DOMContentLoaded', async function () {
    showPasswordToggles();
    const form = document.querySelector('[data-auth-form]');
    const message = document.getElementById('authMessage');
    let client;

    try {
      const requestedStorage = form?.dataset.authForm === 'register'
        ? 'localStorage'
        : localStorage.getItem('campuscash_session_storage') || 'localStorage';
      client = clientFor(requestedStorage);
      if (!form) {
        const { data: { user }, error } = await client.auth.getUser();
        if (error) throw error;
        if (user) window.location.replace('dashboard.html');
        return;
      }
    } catch (error) {
      if (message) formMessage(message, error.message, 'error');
      if (form) form.querySelectorAll('input, button').forEach(element => element.disabled = true);
      return;
    }

    const type = form.dataset.authForm;
    const resetForm = document.getElementById('resetPasswordForm');
    const isPasswordRecovery = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';
    if (isPasswordRecovery && resetForm) {
      form.hidden = true;
      resetForm.hidden = false;
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (error) throw error;
        if (!session) throw new Error('This password reset link is invalid or has expired. Request a new one.');
        resetForm.addEventListener('submit', async function (event) {
          event.preventDefault();
          const password = document.getElementById('newPassword').value;
          const confirmation = document.getElementById('confirmNewPassword').value;
          if (password.length < 8) {
            formMessage(message, 'Use a password with at least 8 characters.', 'error');
            return;
          }
          if (password !== confirmation) {
            formMessage(message, 'Your passwords do not match.', 'error');
            return;
          }
          const submit = resetForm.querySelector('[type="submit"]');
          submit.disabled = true;
          try {
            const { error: updateError } = await client.auth.updateUser({ password });
            if (updateError) throw updateError;
            formMessage(message, 'Your password has been updated. Opening your dashboard…', 'success');
            window.setTimeout(() => window.location.replace('dashboard.html'), 900);
          } catch (error) {
            formMessage(message, error.message || 'Password update failed. Request another reset link.', 'error');
            submit.disabled = false;
          }
        });
      } catch (error) {
        formMessage(message, error.message, 'error');
        resetForm.querySelectorAll('input, button').forEach(element => element.disabled = true);
      }
      return;
    }
    try {
      const { data: { user }, error } = await client.auth.getUser();
      if (error) throw error;
      if (user) {
        window.location.replace('dashboard.html');
        return;
      }
    } catch (error) {
      formMessage(message, error.message, 'error');
      return;
    }
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      formMessage(message, '', '');
      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      submit.dataset.originalText = submit.textContent;
      submit.textContent = type === 'register' ? 'Creating account…' : 'Signing in…';

      try {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        let result;
        if (type === 'register') {
          const fullName = document.getElementById('fullName').value.trim();
          const confirmation = document.getElementById('confirmPassword').value;
          if (!fullName || !email || !password || !confirmation) throw new Error('Please complete every field.');
          if (fullName.length < 2 || fullName.length > 120) throw new Error('Your full name must be between 2 and 120 characters.');
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
          if (password.length < 8) throw new Error('Use a password with at least 8 characters.');
          if (password !== confirmation) throw new Error('Your passwords do not match.');
          result = await client.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
          });
          if (result.error) throw result.error;
          if (!result.data.session) {
            formMessage(message, 'Account created. Check your email to confirm your address, then log in.', 'success');
          } else {
            localStorage.setItem('campuscash_session_storage', 'localStorage');
            window.location.replace('dashboard.html');
          }
        } else {
          if (!email || !password) throw new Error('Enter your email address and password.');
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
          const remember = document.getElementById('rememberMe').checked;
          const selectedStorage = remember ? 'localStorage' : 'sessionStorage';
          const previousStorage = localStorage.getItem('campuscash_session_storage') || 'localStorage';
          if (previousStorage !== selectedStorage) {
            const { error: signOutError } = await client.auth.signOut({ scope: 'local' });
            if (signOutError) throw signOutError;
          }
          client = window.createCampusCashClient(selectedStorage);
          result = await client.auth.signInWithPassword({ email, password });
          if (result.error) throw result.error;
          localStorage.setItem('campuscash_session_storage', selectedStorage);
          window.location.replace('dashboard.html');
        }
      } catch (error) {
        formMessage(message, error.message || 'We could not complete that request. Please try again.', 'error');
      } finally {
        submit.disabled = false;
        submit.textContent = submit.dataset.originalText;
      }
    });

    const resetButton = document.getElementById('forgotPassword');
    if (resetButton) {
      resetButton.addEventListener('click', async function () {
        formMessage(message, '', '');
        const email = document.getElementById('email').value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          formMessage(message, 'Enter your email address above, then choose Forgot password.', 'error');
          return;
        }
        resetButton.disabled = true;
        try {
          const { error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}login.html`
          });
          if (error) throw error;
          formMessage(message, 'If an account exists for that email, a password reset link is on its way.', 'success');
        } catch (error) {
          formMessage(message, error.message || 'Password reset could not be requested. Please try again.', 'error');
        } finally {
          resetButton.disabled = false;
        }
      });
    }
  });
})();
