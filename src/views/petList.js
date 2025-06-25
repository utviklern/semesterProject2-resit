import { showModal } from '../components/modal.js';

let allPets = [];
let filteredPets = [];
let petsLoaded = 0;
const PETS_PER_PAGE = 8;

export async function renderPetList() {
  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = `
    <div class="w-full max-w-5xl mx-auto">
      <img src="/images/headerimg.JPG" alt="Header" class="w-full h-[70vh] object-cover rounded-xl mb-6" />
      <div class="flex justify-center mb-6">
        <input id="searchInput" type="text" placeholder="search" class="w-full max-w-md rounded-full border border-secondary px-4 py-2 text-center text-xl font-poppins text-gray-400" />
      </div>
      <h2 class="text-2xl font-poppins mb-6">Available pets</h2>
      <div id="petGrid" class="grid grid-cols-2 md:grid-cols-4 gap-6"></div>
      <div class="flex justify-center mt-8">
        <button id="loadMoreBtn" class="bg-accent text-white rounded-full py-2 px-8 font-roboto text-lg hover:bg-secondary transition">Load more</button>
      </div>
    </div>
  `;

  // fetch pets only once
  if (allPets.length === 0) {
    try {
      const { API_KEY } = await import('../services/config.js');
      const res = await fetch('https://v2.api.noroff.dev/pets', {
        headers: { 'X-Noroff-API-Key': API_KEY }
      });
      const data = await res.json();
      allPets = data.data || [];
      // sort newest first
      allPets.sort((a, b) => new Date(b.created) - new Date(a.created));
    } catch (err) {
      showModal('Failed to load pets. Try again.');
      return;
    }
  }

  // initial state: show all pets
  filteredPets = allPets;
  petsLoaded = 0;
  renderPets(true);

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn.addEventListener('click', () => {
    renderPets();
  });

  // search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredPets = allPets.filter(pet =>
      (pet.name && pet.name.toLowerCase().includes(query)) ||
      (pet.species && pet.species.toLowerCase().includes(query)) ||
      (pet.breed && pet.breed.toLowerCase().includes(query))
    );
    petsLoaded = 0;
    renderPets(true);
  });

  function renderPets(reset = false) {
    const grid = document.getElementById('petGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (reset) {
      grid.innerHTML = '';
      petsLoaded = 0;
    }
    const nextPets = filteredPets.slice(petsLoaded, petsLoaded + PETS_PER_PAGE);
    nextPets.forEach(pet => {
      const card = document.createElement('div');
      card.className = "bg-white rounded-2xl shadow-md p-4 flex flex-col items-center cursor-pointer";
      card.innerHTML = `
        <a href="#/pet/${pet.id}" class="block w-full h-full text-inherit no-underline">
          <img src="${pet.image?.url || 'https://sdmntprnortheu.oaiusercontent.com/files/00000000-a1c0-61f4-9943-2034ad1a4a5f/raw?se=2025-06-25T13%3A49%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=58544d5a-bfec-54fd-bd31-80cb3d66d8c3&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-25T05%3A54%3A54Z&ske=2025-06-26T05%3A54%3A54Z&sks=b&skv=2024-08-04&sig=bxA1cA5x4nqdPlOQlgI5W%2BdbkX2Ija60j9D7mrmGgDU%3D'}" alt="${pet.image?.alt || pet.name}" class="w-full h-32 object-cover rounded-xl mb-2" />
          <div class="font-poppins text-lg mb-1 truncate w-full text-center">${pet.name}</div>
          <div class="font-roboto text-sm text-gray-700 mb-1 truncate w-full text-center">Species: ${pet.species || '-'}</div>
          <div class="font-roboto text-sm text-gray-700 mb-1 truncate w-full text-center">Breed: ${pet.breed || '-'}</div>
          <div class="font-roboto text-sm text-gray-700 text-center">Age: ${pet.age || '-'}</div>
        </a>
      `;
      grid.appendChild(card);
    });
    petsLoaded += nextPets.length;
    if (petsLoaded >= filteredPets.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }
}