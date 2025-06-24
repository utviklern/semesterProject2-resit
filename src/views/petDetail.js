import { showModal } from '../components/modal.js';

export async function renderPetDetail(id) {
  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = `<div class="text-center text-lg font-roboto">Loading...</div>`;

  try {
    const { API_KEY } = await import('../services/config.js');
    const res = await fetch(`https://v2.api.noroff.dev/pets/${id}`, {
      headers: { 'X-Noroff-API-Key': API_KEY }
    });
    if (!res.ok) throw new Error('Failed to fetch pet');
    const pet = (await res.json()).data;

    // format dates
    const created = pet.created ? new Date(pet.created).toLocaleDateString() : '-';
    const updated = pet.updated ? new Date(pet.updated).toLocaleDateString() : '-';

    app.innerHTML = `
      <div class="w-full max-w-5xl mx-auto">
        <img src="${pet.image?.url || 'https://placehold.co/800x400?text=Pet'}" alt="${pet.image?.alt || pet.name}" class="w-full max-w-xl h-64 md:h-96 object-cover rounded-xl mb-6 mx-auto" />
        <div class="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start mb-8 gap-6">
          <div class="w-full text-center md:text-left">
            <h1 class="text-4xl font-poppins mb-4 text-center md:text-left">${pet.name}</h1>
            <div class="font-roboto text-base mb-2 flex flex-col md:flex-row md:flex-wrap md:gap-4 justify-center md:justify-start items-center md:items-start text-center md:text-left">
              <span class="block md:inline">Species: <span class="font-semibold">${pet.species || '-'}</span></span>
              <span class="block md:inline">Breed: <span class="font-semibold">${pet.breed || '-'}</span></span>
              <span class="block md:inline">Age: <span class="font-semibold">${pet.age || '-'}</span></span>
              <span class="block md:inline">Gender: <span class="font-semibold">${pet.gender || '-'}</span></span>
              <span class="block md:inline">Color: <span class="font-semibold">${pet.color || '-'}</span></span>
            </div>
          </div>
        </div>
        <h2 class="text-2xl font-poppins mb-4 text-center md:text-left">Description</h2>
        <div class="bg-white rounded-xl shadow-md p-6 mb-8 font-roboto text-base text-gray-800 whitespace-pre-line text-center md:text-left">${pet.description || ''}</div>
        <div class="mt-8 text-center">
          <div class="font-poppins text-lg mb-1">Owner</div>
          <div class="font-roboto text-base">${pet.owner?.name || '-'}</div>
          <div class="font-roboto text-base">${pet.owner?.email || ''}</div>
        </div>
        <div class="text-center text-xs font-roboto text-gray-500 mt-4">
          Created: ${created}<br>
          Updated: ${updated}
        </div>
      </div>
    `;
  } catch (err) {
    showModal('Failed to load pet details. Try again.');
  }
} 