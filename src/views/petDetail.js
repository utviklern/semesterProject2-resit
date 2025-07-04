import { showModal } from '../components/modal.js';
import { renderSpinner } from '../components/spinner.js';

export async function renderPetDetail(id) {
  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = renderSpinner();

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
        <img src="${pet.image?.url || 'https://sdmntprnortheu.oaiusercontent.com/files/00000000-a1c0-61f4-9943-2034ad1a4a5f/raw?se=2025-06-25T13%3A49%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=58544d5a-bfec-54fd-bd31-80cb3d66d8c3&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-25T05%3A54%3A54Z&ske=2025-06-26T05%3A54%3A54Z&sks=b&skv=2024-08-04&sig=bxA1cA5x4nqdPlOQlgI5W%2BdbkX2Ija60j9D7mrmGgDU%3D'}" alt="${pet.image?.alt || pet.name}" class="w-full max-w-xl h-64 md:h-96 object-cover rounded-xl mb-6 mx-auto" />
        <div class="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start mb-8 gap-6">
          <div class="w-full text-center md:text-left">
            <h1 class="text-4xl font-poppins mb-4 text-center md:text-left break-words">${pet.name}</h1>
            <div class="font-roboto text-base mb-2 flex flex-col md:flex-row md:flex-wrap md:gap-4 justify-center md:justify-start items-center md:items-start text-center md:text-left">
              <span class="block md:inline">Species: <span class="font-semibold">${pet.species || '-'}</span></span>
              <span class="block md:inline">Breed: <span class="font-semibold">${pet.breed || '-'}</span></span>
              <span class="block md:inline">Age: <span class="font-semibold">${pet.age || '-'}</span></span>
              <span class="block md:inline">Gender: <span class="font-semibold">${pet.gender || '-'}</span></span>
              <span class="block md:inline">Size: <span class="font-semibold">${pet.size || '-'}</span></span>
              <span class="block md:inline">Color: <span class="font-semibold">${pet.color || '-'}</span></span>
              <span class="block md:inline">Location: <span class="font-semibold">${pet.location || '-'}</span></span>
              <span class="block md:inline">Status: <span class="font-semibold">${pet.adoptionStatus || '-'}</span></span>
            </div>
          </div>
          <button id="shareBtn" class="bg-accent text-white rounded-full p-3 hover:bg-secondary transition" title="Share this pet">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
          </button>
        </div>
        <h2 class="text-2xl font-poppins mb-4 text-center md:text-left break-words">Description</h2>
        <div class="bg-white rounded-xl shadow-md p-6 mb-8 font-roboto text-base text-gray-800 whitespace-pre-line break-words overflow-wrap-anywhere text-center md:text-left">${pet.description || ''}</div>
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

    // share functionality
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showModal('Link copied to clipboard!');
        } catch (err) {
          // fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          showModal('Link copied to clipboard!');
        }
      });
    }
  } catch (err) {
    showModal('Failed to load pet details. Try again.');
  }
} 