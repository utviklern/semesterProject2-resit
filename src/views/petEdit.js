import { showModal } from '../components/modal.js';
import { getToken } from '../services/auth.js';

export async function renderPetEdit(id) {
  // Redirect to login if not authenticated
  if (!getToken()) {
    showModal('You must be logged in to edit a pet.');
    window.location.hash = '#/account/login';
    return;
  }

  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = `<div class="text-center text-lg font-roboto">Loading...</div>`;

  try {
    const { API_KEY } = await import('../services/config.js');
    // Fetch pet data
    const res = await fetch(`https://v2.api.noroff.dev/pets/${id}`, {
      headers: { 'X-Noroff-API-Key': API_KEY }
    });
    if (!res.ok) throw new Error('Failed to fetch pet');
    const pet = (await res.json()).data;

    // Render form with populated values
    app.innerHTML = `
      <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-md mt-8">
        <h1 class="text-3xl font-light mb-6 text-center text-primary font-poppins">Edit</h1>
        <form id="editPetForm" class="flex flex-col gap-4">
          <label class="text-base text-primary font-roboto">Name
            <input type="text" id="name" value="${pet.name || ''}" required maxlength="18" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
            <div class="text-xs text-right text-gray-400"><span id="nameCount">${pet.name?.length || 0}</span>/18</div>
          </label>
          <label class="text-base text-primary font-roboto">Species
            <input type="text" id="species" value="${pet.species || ''}" required maxlength="18" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
            <div class="text-xs text-right text-gray-400"><span id="speciesCount">${pet.species?.length || 0}</span>/18</div>
          </label>
          <label class="text-base text-primary font-roboto">Breed
            <input type="text" id="breed" value="${pet.breed || ''}" required maxlength="24" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
            <div class="text-xs text-right text-gray-400"><span id="breedCount">${pet.breed?.length || 0}</span>/24</div>
          </label>
          <label class="text-base text-primary font-roboto">Age
            <input type="number" id="age" value="${pet.age || ''}" required min="0" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Gender
            <select id="gender" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto">
              <option value="">Select gender</option>
              <option value="male" ${pet.gender === 'male' ? 'selected' : ''}>Male</option>
              <option value="female" ${pet.gender === 'female' ? 'selected' : ''}>Female</option>
              <option value="unknown" ${pet.gender === 'unknown' ? 'selected' : ''}>Unknown</option>
            </select>
          </label>
          <label class="text-base text-primary font-roboto">Size
            <input type="text" id="size" value="${pet.size || ''}" required placeholder="23kg" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Color
            <input type="text" id="color" value="${pet.color || ''}" required maxlength="18" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
            <div class="text-xs text-right text-gray-400"><span id="colorCount">${pet.color?.length || 0}</span>/18</div>
          </label>
          <label class="text-base text-primary font-roboto">Location
            <input type="text" id="location" value="${pet.location || ''}" required maxlength="20" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
            <div class="text-xs text-right text-gray-400"><span id="locationCount">${pet.location?.length || 0}</span>/20</div>
          </label>
          <label class="text-base text-primary font-roboto">Adoption Status
            <select id="adoptionStatus" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto">
              <option value="Available" ${pet.adoptionStatus === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Pending" ${pet.adoptionStatus === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Adopted" ${pet.adoptionStatus === 'Adopted' ? 'selected' : ''}>Adopted</option>
            </select>
          </label>
          <label class="text-base text-primary font-roboto">Description
            <textarea id="description" maxlength="1000" rows="3" required class="w-full mt-1 rounded-2xl border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto">${pet.description || ''}</textarea>
            <div class="text-xs text-right text-gray-400"><span id="descCount">${pet.description?.length || 0}</span>/1000</div>
          </label>
          <label class="text-base text-primary font-roboto">Image URL
            <input type="url" id="imageUrl" value="${pet.image?.url || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Alt
            <input type="text" id="imageAlt" value="${pet.image?.alt || ''}" required maxlength="120" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
            <div class="text-xs text-right text-gray-400"><span id="altCount">${pet.image?.alt?.length || 0}</span>/120</div>
          </label>
          <div class="flex gap-4 mt-4">
            <button type="submit" class="flex-1 bg-accent text-white rounded-full py-2 font-roboto text-lg hover:bg-secondary transition">Update post</button>
            <button type="button" id="deleteBtn" class="flex-1 bg-red-600 text-white rounded-full py-2 font-roboto text-lg hover:bg-red-700 transition">Delete</button>
          </div>
        </form>
      </div>
    `;

    // Description character count
    const desc = document.getElementById('description');
    const descCount = document.getElementById('descCount');
    if (desc && descCount) {
      desc.addEventListener('input', () => {
        descCount.textContent = desc.value.length;
      });
    }

    // character counters
    const name = document.getElementById('name');
    const nameCount = document.getElementById('nameCount');
    if (name && nameCount) {
      name.addEventListener('input', () => {
        nameCount.textContent = name.value.length;
      });
    }

    const species = document.getElementById('species');
    const speciesCount = document.getElementById('speciesCount');
    if (species && speciesCount) {
      species.addEventListener('input', () => {
        speciesCount.textContent = species.value.length;
      });
    }

    const breed = document.getElementById('breed');
    const breedCount = document.getElementById('breedCount');
    if (breed && breedCount) {
      breed.addEventListener('input', () => {
        breedCount.textContent = breed.value.length;
      });
    }

    const color = document.getElementById('color');
    const colorCount = document.getElementById('colorCount');
    if (color && colorCount) {
      color.addEventListener('input', () => {
        colorCount.textContent = color.value.length;
      });
    }

    const location = document.getElementById('location');
    const locationCount = document.getElementById('locationCount');
    if (location && locationCount) {
      location.addEventListener('input', () => {
        locationCount.textContent = location.value.length;
      });
    }

    const imageAlt = document.getElementById('imageAlt');
    const altCount = document.getElementById('altCount');
    if (imageAlt && altCount) {
      imageAlt.addEventListener('input', () => {
        altCount.textContent = imageAlt.value.length;
      });
    }

    // Update post
    const form = document.getElementById('editPetForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Get form values
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

      // Validation (same as create)
      if (!name || !species || !breed || !color || !description || !imageUrl || !imageAlt || !gender || !location) {
        showModal('All fields are required.');
        return;
      }
      if (isNaN(age) || age < 0) {
        showModal('Age must be a non-negative number.');
        return;
      }
      if (size.length === 0) {
        showModal('Size must be provided.');
        return;
      }
      const sizeNumber = parseFloat(size);
      if (isNaN(sizeNumber) || sizeNumber < 0 || sizeNumber > 200) {
        showModal('Size must be a number between 0 and 200 kg.');
        return;
      }
      if (name.length > 18) {
        showModal('Name must be 18 characters or less.');
        return;
      }
      if (species.length > 18) {
        showModal('Species must be 18 characters or less.');
        return;
      }
      if (breed.length > 24) {
        showModal('Breed must be 24 characters or less.');
        return;
      }
      if (color.length > 18) {
        showModal('Color must be 18 characters or less.');
        return;
      }
      if (location.length > 20) {
        showModal('Location must be 20 characters or less.');
        return;
      }
      if (description.length > 1000) {
        showModal('Description must be less than 1000 characters.');
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

      // Build request body
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

      try {
        const token = getToken();
        if (!token) {
          showModal('You must be logged in to update a pet.');
          return;
        }
        const response = await fetch(`https://v2.api.noroff.dev/pets/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': API_KEY,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          const data = await response.json();
          showModal(data.errors?.[0]?.message || 'Failed to update pet.');
          return;
        }
        showModal('Pet updated successfully!');
        setTimeout(() => {
          window.location.hash = '#/profile';
        }, 1200);
      } catch (err) {
        showModal('Failed to update pet. Try again.');
      }
    });

    // Delete post
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this pet?')) return;
        try {
          const token = getToken();
          if (!token) {
            showModal('You must be logged in to delete a pet.');
            return;
          }
          const response = await fetch(`https://v2.api.noroff.dev/pets/${id}`, {
            method: 'DELETE',
            headers: {
              'X-Noroff-API-Key': API_KEY,
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            const data = await response.json();
            showModal(data.errors?.[0]?.message || 'Failed to delete pet.');
            return;
          }
          showModal('Pet deleted successfully!');
          setTimeout(() => {
            window.location.hash = '#/profile';
          }, 1200);
        } catch (err) {
          showModal('Failed to delete pet. Try again.');
        }
      });
    }
  } catch (err) {
    showModal('Failed to load pet. Try again.');
  }
} 