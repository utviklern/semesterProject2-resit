import { renderNavbar, removeNavbar } from '../components/navbar.js';

export function renderLogin() {
  const app = document.getElementById('app');
  app.className = "flex-1 flex flex-col items-center justify-center px-2";
  app.innerHTML = `
    <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-md mt-8">
      <h1 class="text-3xl font-light mb-6 text-center text-primary font-poppins">Login or register</h1>
      <form id="loginForm" class="flex flex-col gap-4">
        <label class="text-base text-primary font-roboto">E-mail
          <input type="email" id="email" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <label class="text-base text-primary font-roboto">Password
          <input type="password" id="password" required class="w-full mt-1 rounded-full border border-secondary px-4 py-2 bg-beige focus:outline-none focus:ring-2 focus:ring-accent font-roboto" />
        </label>
        <button type="submit" class="bg-accent text-white rounded-full py-2 mt-2 hover:bg-secondary transition font-roboto text-lg">Login</button>
        <div id="error" class="text-red-500 text-center text-sm font-roboto"></div>
      </form>
      <p class="text-center mt-4 text-sm text-primary font-roboto">
        Don't have an account? <a href="#/account/register" class="underline text-accent hover:text-secondary font-roboto">Register HERE</a>
      </p>
    </div>
  `;

  // event listener for login
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('error');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.textContent = '';
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        // import login and saveToken dynamically to avoid circular dependency
        const auth = await import('../services/auth.js');
        const token = await auth.login(email, password);
        auth.saveToken(token);
        removeNavbar();
        renderNavbar();
        window.location.hash = '#/';
      } catch (err) {
        errorDiv.textContent = 'Invalid email or password!';
      }
    });
  }
} 