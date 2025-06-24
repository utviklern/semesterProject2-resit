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
            <input type="text" id="name" value="${pet.name || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Species
            <input type="text" id="species" value="${pet.species || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Breed
            <input type="text" id="breed" value="${pet.breed || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Age
            <input type="number" id="age" value="${pet.age || ''}" required min="0" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Gender
            <input type="text" id="gender" value="${pet.gender || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Size
            <input type="text" id="size" value="${pet.size || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Color
            <input type="text" id="color" value="${pet.color || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Location
            <input type="text" id="location" value="${pet.location || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Adoption Status
            <select id="adoptionStatus" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto">
              <option value="Available" ${pet.adoptionStatus === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Pending" ${pet.adoptionStatus === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Adopted" ${pet.adoptionStatus === 'Adopted' ? 'selected' : ''}>Adopted</option>
            </select>
          </label>
          <label class="text-base text-primary font-roboto">Description
            <textarea id="description" maxlength="160" rows="3" required class="w-full mt-1 rounded-2xl border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto">${pet.description || ''}</textarea>
            <div class="text-xs text-right text-gray-400"><span id="descCount">${pet.description?.length || 0}</span>/160</div>
          </label>
          <label class="text-base text-primary font-roboto">Image URL
            <input type="url" id="imageUrl" value="${pet.image?.url || ''}" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
          </label>
          <label class="text-base text-primary font-roboto">Alt
            <input type="text" id="imageAlt" value="${pet.image?.alt || ''}" required maxlength="120" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
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