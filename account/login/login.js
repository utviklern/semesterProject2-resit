import { login, saveToken } from '../../src/services/auth.js';

const form = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorDiv.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const token = await login(email, password);
    saveToken(token);
    window.location.href = '/'; 
  } catch (err) {
    errorDiv.textContent = 'Invalid email or password!';
  }
});     