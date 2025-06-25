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
        <img src="${user.avatar?.url || 'https://sdmntprnortheu.oaiusercontent.com/files/00000000-a1c0-61f4-9943-2034ad1a4a5f/raw?se=2025-06-25T13%3A49%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=58544d5a-bfec-54fd-bd31-80cb3d66d8c3&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-25T05%3A54%3A54Z&ske=2025-06-26T05%3A54%3A54Z&sks=b&skv=2024-08-04&sig=bxA1cA5x4nqdPlOQlgI5W%2BdbkX2Ija60j9D7mrmGgDU%3D'}" alt="${user.avatar?.alt || user.name}" class="rounded-full w-40 h-40 object-cover border-2 border-secondary mb-4" />
        <div class="text-2xl font-poppins mb-2">${user.name}</div>
        <div class="text-base font-roboto text-gray-700 mb-4">${user.bio || ''}</div>
        <button id="createPostBtn" class="bg-accent text-white rounded-full py-2 px-8 mb-8 font-roboto text-lg hover:bg-secondary transition">Create post</button>
        <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          ${myPets.length === 0 ? `<div class='col-span-3 text-center text-gray-400 font-roboto'>No posts yet.</div>` : myPets.map(pet => `
            <div class="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center cursor-pointer">
              <a href="#/pet/${pet.id}" class="block w-full h-full text-inherit no-underline">
                <img src="${pet.image?.url || 'https://sdmntprnortheu.oaiusercontent.com/files/00000000-a1c0-61f4-9943-2034ad1a4a5f/raw?se=2025-06-25T13%3A49%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=58544d5a-bfec-54fd-bd31-80cb3d66d8c3&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-25T05%3A54%3A54Z&ske=2025-06-26T05%3A54%3A54Z&sks=b&skv=2024-08-04&sig=bxA1cA5x4nqdPlOQlgI5W%2BdbkX2Ija60j9D7mrmGgDU%3D'}" alt="${pet.image?.alt || pet.name}" class="w-full h-40 object-cover rounded-xl mb-2" />
                <div class="font-roboto text-lg mb-2">${pet.name}</div>
              </a>
              <button onclick="window.location.hash='#/pet/edit/${pet.id}'" class="bg-accent text-white rounded-full py-2 px-6 font-roboto hover:bg-secondary transition mt-2">Edit post</button>
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