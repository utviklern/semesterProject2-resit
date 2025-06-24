import { showModal } from '../components/modal.js';
import { getToken } from '../services/auth.js';

export function renderPetCreate() {
  // redirect to login if not authenticated
  if (!getToken()) {
    showModal('You must be logged in to create a pet.');
    window.location.hash = '#/account/login';
    return;
  }

  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = `
    <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-md mt-8">
      <h1 class="text-3xl font-light mb-6 text-center text-primary font-poppins">Create</h1>
      <form id="createPetForm" class="flex flex-col gap-4">
        <label class="text-base text-primary font-roboto">Name
          <input type="text" id="name" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Species
          <input type="text" id="species" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Breed
          <input type="text" id="breed" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Age
          <input type="number" id="age" required min="0" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Gender
          <input type="text" id="gender" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Size
          <input type="text" id="size" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Color
          <input type="text" id="color" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Location
          <input type="text" id="location" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Adoption Status
          <select id="adoptionStatus" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto">
            <option value="Available" selected>Available</option>
            <option value="Pending">Pending</option>
            <option value="Adopted">Adopted</option>
          </select>
        </label>
        <label class="text-base text-primary font-roboto">Description
          <textarea id="description" maxlength="160" rows="3" required class="w-full mt-1 rounded-2xl border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto"></textarea>
          <div class="text-xs text-right text-gray-400"><span id="descCount">0</span>/160</div>
        </label>
        <label class="text-base text-primary font-roboto">Image URL
          <input type="url" id="imageUrl" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Alt
          <input type="text" id="imageAlt" required maxlength="120" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <button type="submit" class="bg-accent text-white rounded-full py-2 mt-2 hover:bg-secondary transition font-roboto text-lg">Create post</button>
      </form>
    </div>
  `;

  // description character count
  const desc = document.getElementById('description');
  const descCount = document.getElementById('descCount');
  if (desc && descCount) {
    desc.addEventListener('input', () => {
      descCount.textContent = desc.value.length;
    });
  }

  const form = document.getElementById('createPetForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get form values
    const name = document.getElementById('name').value.trim();
    const species = document.getElementById('species').value.trim();
    const breed = document.getElementById('breed').value.trim();
    const age = parseInt(document.getElementById('age').value, 10);
    const gender = document.getElementById('gender').value.trim();
    const size = document.getElementById('size').value.trim();
    const color = document.getElementById('color').value.trim();
    const location = document.getElementById('location').value.trim();
    const adoptionStatus = document.getElementById('adoptionStatus').value.trim() || 'Available';
    const description = document.getElementById('description').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const imageAlt = document.getElementById('imageAlt').value.trim();

    // validation
    if (!name || !species || !breed || !size || !color || !description || !imageUrl || !imageAlt || !gender || !location) {
      showModal('All fields are required.');
      return;
    }
    if (isNaN(age) || age < 0) {
      showModal('Age must be a non-negative number.');
      return;
    }
    if (description.length > 160) {
      showModal('Description must be less than 160 characters.');
      return;
    }
    if (!/^https?:\/\/.+\..+/.test(imageUrl)) {
      showModal('Image URL must be a valid URL.');
      return;
    }
    if (imageAlt.length > 120) {
      showModal('Alt text must be less than 120 characters.');
      return;
    }

    // build request body
    const body = {
      name,
      species,
      breed,
      age,
      gender,
      size,
      color,
      location,
      adoptionStatus,
      description,
      image: {
        url: imageUrl,
        alt: imageAlt
      }
    };

    // get API key and token
    try {
      const { API_KEY } = await import('../services/config.js');
      const token = getToken();
      if (!token) {
        showModal('You must be logged in to create a pet.');
        return;
      }
      // send POST request
      const response = await fetch('https://v2.api.noroff.dev/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': API_KEY,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const data = await response.json();
        showModal(data.errors?.[0]?.message || 'Failed to create pet.');
        return;
      }
      // success
      showModal('Pet created successfully!');
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1200);
    } catch (err) {
      showModal('Failed to create pet. Try again.');
    }
  });
} 