import { showModal } from '../components/modal.js';
import { getToken } from '../services/auth.js';

export async function renderProfile() {
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

    // fetch all pets
    const { API_KEY } = await import('../services/config.js');
    const petsRes = await fetch('https://v2.api.noroff.dev/pets', {
      headers: { 'X-Noroff-API-Key': API_KEY }
    });
    const petsData = await petsRes.json();
    const myPets = petsData.data.filter(pet => pet.owner?.email === user.email);

    // render avatar, name, bio, create post button, and user's pets
    app.innerHTML = `
      <div class="flex flex-col items-center w-full">
        <h1 class="text-3xl font-poppins mb-6 mt-4">Profile</h1>
        <img src="${user.avatar?.url || 'https://placehold.co/160x160?text=Avatar'}" alt="${user.avatar?.alt || user.name}" class="rounded-full w-40 h-40 object-cover border-2 border-secondary mb-4" />
        <div class="text-2xl font-poppins mb-2">${user.name}</div>
        <div class="text-base font-roboto text-gray-700 mb-4">${user.bio || ''}</div>
        <button id="createPostBtn" class="bg-accent text-white rounded-full py-2 px-8 mb-8 font-roboto text-lg hover:bg-secondary transition">Create post</button>
        <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          ${myPets.length === 0 ? `<div class='col-span-3 text-center text-gray-400 font-roboto'>No posts yet.</div>` : myPets.map(pet => `
            <div class="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
              <img src="${pet.image?.url || 'https://placehold.co/200x160?text=Pet'}" alt="${pet.image?.alt || pet.name}" class="w-full h-40 object-cover rounded-xl mb-2" />
              <div class="font-roboto text-lg mb-2">${pet.name}</div>
              <button onclick="window.location.hash='#/pet/edit/${pet.id}'" class="bg-accent text-white rounded-full py-2 px-6 font-roboto hover:bg-secondary transition">Edit post</button>
            </div>
          `).join('')}
        </div>
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