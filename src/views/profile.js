import { showModal } from '../components/modal.js';
import { getToken } from '../services/auth.js';

export function renderProfile() {
  // redirect to login if not authenticated
  if (!getToken()) {
    showModal('You must be logged in to view your profile.');
    window.location.hash = '#/account/login';
    return;
  }

  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = `<div class="text-center text-lg font-roboto">Loading...</div>`;

  try {
    // get user profile from localStorage
    const user = JSON.parse(localStorage.getItem('userProfile'));
    if (!user) {
      showModal('User profile not found. Please log in again.');
      window.location.hash = '#/account/login';
      return;
    }

    // render avatar, name, bio, and create post button
    app.innerHTML = `
      <div class="flex flex-col items-center w-full">
        <h1 class="text-3xl font-poppins mb-6 mt-4">Profile</h1>
        <img src="${user.avatar?.url || 'https://placehold.co/160x160?text=Avatar'}" alt="${user.avatar?.alt || user.name}" class="rounded-full w-40 h-40 object-cover border-2 border-secondary mb-4" />
        <div class="text-2xl font-poppins mb-2">${user.name}</div>
        <div class="text-base font-roboto text-gray-700 mb-4">${user.bio || ''}</div>
        <button id="createPostBtn" class="bg-accent text-white rounded-full py-2 px-8 mb-8 font-roboto text-lg hover:bg-secondary transition">Create post</button>
      </div>
    `;

    // add event listener for create post button
    const createBtn = document.getElementById('createPostBtn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        window.location.hash = '#/pet/create';
      });
    }
  } catch (err) {
    showModal('Failed to load profile. Try again.');
  }
} 