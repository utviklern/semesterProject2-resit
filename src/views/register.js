import { showModal } from '../components/modal.js';
import { renderSpinner } from '../components/spinner.js';

export function renderRegister() {
  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = `
    <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-md mt-8">
      <h1 class="text-3xl font-light mb-6 text-center text-primary font-poppins">Register</h1>
      <form id="registerForm" class="flex flex-col gap-4">
        <label class="text-base text-primary font-roboto">Username
          <input type="text" id="name" required pattern="^[A-Za-z0-9_]+$" title="Username can only contain letters, numbers and underscores" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">E-mail
          <input type="email" id="email" required pattern=".*@stud\.noroff\.no$" title="Email must be a valid stud.noroff.no address" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Password
          <input type="password" id="password" required minlength="8" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Confirm Password
          <input type="password" id="confirmPassword" required minlength="8" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Avatar Url
          <input type="url" id="avatarUrl" class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Bio
          <textarea id="bio" maxlength="160" rows="3" class="w-full mt-1 rounded-2xl border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto"></textarea>
          <div class="text-xs text-right text-gray-400"><span id="bioCount">0</span>/160</div>
        </label>
        <button type="submit" class="bg-accent text-white rounded-full py-2 mt-2 hover:bg-secondary transition font-roboto text-lg">Register</button>
      </form>
      <p class="text-center mt-4 text-sm text-primary font-roboto">
        Already have an account? <a href="#/account/login" class="underline text-accent hover:text-secondary font-roboto">Login HERE</a>
      </p>
    </div>
  `;

  // bio character count
  const bio = document.getElementById('bio');
  const bioCount = document.getElementById('bioCount');
  if (bio && bioCount) {
    bio.addEventListener('input', () => {
      bioCount.textContent = bio.value.length;
    });
  }

  const form = document.getElementById('registerForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const avatarUrl = document.getElementById('avatarUrl').value.trim();
    const bio = document.getElementById('bio').value.trim();

    // validation
    if (!name || !email || !password || !confirmPassword) {
      showModal('All fields are required.');
      return;
    }
    
    // Username validation - letters, numbers, underscores only
    if (!/^[A-Za-z0-9_]+$/.test(name)) {
      showModal('Username can only contain letters, numbers and underscores.');
      return;
    }
    
    // Email validation - must be stud.noroff.no
    if (!email.endsWith('@stud.noroff.no')) {
      showModal('Email must be a valid stud.noroff.no address.');
      return;
    }
    
    if (password !== confirmPassword) {
      showModal('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      showModal('Password must be at least 8 characters long.');
      return;
    }

    // avatar URL validation
    if (avatarUrl && !/^https?:\/\/.+\..+/.test(avatarUrl)) {
      showModal('Avatar URL must be a valid URL.');
      return;
    }

    // bio validation
    if (bio && bio.length > 160) {
      showModal('Bio must be less than 160 characters.');
      return;
    }

    // build request body
    const body = {
      name,
      email,
      password
    };
    
    // add optional fields if provided
    if (bio) body.bio = bio;
    if (avatarUrl) body.avatar = { url: avatarUrl, alt: '' };

    try {
      const { API_KEY } = await import('../services/config.js');
      const response = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': API_KEY
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const data = await response.json();
        console.log('Registration error:', data); // Debug log
        const errorMessage = data.errors?.[0]?.message || data.message || 'Registration failed.';
        showModal(errorMessage);
        return;
      }
      // success
      showModal('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.hash = '#/account/login';
      }, 1500);
    } catch (err) {
      console.log('Registration catch error:', err); // Debug log
      showModal('Registration failed. Please check your connection and try again.');
    }
  });
}
