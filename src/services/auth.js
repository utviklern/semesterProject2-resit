import { API_KEY } from './config.js';

const API_BASE = 'https://v2.api.noroff.dev';

// save token to local storage
export function saveToken(token) {
  localStorage.setItem('token', token);
}

// get token from local storage
export function getToken() {
  return localStorage.getItem('token');
}

// delete token (logout)
export function logout() {
  localStorage.removeItem('token');
}

// check if logged in
export function isLoggedIn() {
  return !!getToken();
}

// register new user
export async function register(name, email, password) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY
    },
    body: JSON.stringify({ name, email, password })
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  const data = await response.json();
  return data.data.accessToken;
}

// login user
export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY
    },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  return data.data.accessToken;
} 