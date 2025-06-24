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
      <img src="/images/headerimg.webp" alt="Header" class="w-full h-64 md:h-96 object-cover rounded-xl mb-6" />
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
          <img src="${pet.image?.url || 'https://placehold.co/200x160?text=Pet'}" alt="${pet.image?.alt || pet.name}" class="w-full h-32 object-cover rounded-xl mb-2" />
          <div class="font-poppins text-lg mb-1">${pet.name}</div>
          <div class="font-roboto text-sm text-gray-700 mb-1">Species: ${pet.species || '-'}</div>
          <div class="font-roboto text-sm text-gray-700 mb-1">Breed: ${pet.breed || '-'}</div>
          <div class="font-roboto text-sm text-gray-700">Age: ${pet.age || '-'}</div>
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