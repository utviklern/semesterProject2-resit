import { isLoggedIn, logout } from '../services/auth.js';

export function renderNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'bg-beige flex items-center justify-between px-4 py-4 md:py-8 w-full relative';

  nav.innerHTML = `
    <div class="flex items-center gap-2">
      <img src="/images/logo.webp" alt="Petlify logo" class="h-14 w-14 md:h-24 md:w-24" />
    </div>
    <button id="hamburger" class="md:hidden block focus:outline-none z-50" aria-label="Open menu">
      <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2 6h20M2 12h20M2 18h20"/>
      </svg>
    </button>
    <div id="mobileMenu" class="fixed top-0 right-0 h-full w-1/2 min-w-[200px] bg-beige bg-opacity-95 flex flex-col items-center justify-center hidden md:hidden z-40 shadow-lg">
      <ul class="flex flex-col gap-16 items-center justify-center h-full">
        <li><a href="/" class="text-primary text-2xl font-roboto">Home</a></li>
        ${isLoggedIn() ? `
          <li><a href="/profile/index.html" class="text-primary text-2xl font-roboto">Profile</a></li>
          <li><button id="logoutBtnMobile" class="text-primary text-2xl font-roboto">Logout</button></li>
        ` : `
          <li><a href="/account/login/index.html" class="text-primary text-2xl font-roboto">Login</a></li>
        `}
      </ul>
    </div>
    <ul id="navLinks" class="hidden md:flex flex-1 justify-center md:gap-32 gap-12 items-center">
      <li class="my-4 md:my-0"><a href="/" class="text-primary text-lg md:text-2xl font-roboto block py-4 md:py-0 text-center">Home</a></li>
      ${isLoggedIn() ? `
        <li class="my-4 md:my-0"><a href="/profile/index.html" class="text-primary text-lg md:text-2xl font-roboto block py-4 md:py-0 text-center">Profile</a></li>
        <li class="my-4 md:my-0"><button id="logoutBtn" class="text-primary text-lg md:text-2xl font-roboto block py-4 md:py-0 text-center">Logout</button></li>
      ` : `
        <li class="my-4 md:my-0"><a href="/account/login/index.html" class="text-primary text-lg md:text-2xl font-roboto block py-4 md:py-0 text-center">Login</a></li>
      `}
    </ul>
  `;

  document.body.prepend(nav);

  // hamburger toggle for modal menu
  const hamburger = nav.querySelector('#hamburger');
  const mobileMenu = nav.querySelector('#mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (!mobileMenu.classList.contains('hidden')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // close menu when click a link 
  mobileMenu.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });

  // Logout
  if (isLoggedIn()) {
    const logoutBtn = nav.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        logout();
        window.location.href = '/';
      };
    }
    const logoutBtnMobile = nav.querySelector('#logoutBtnMobile');
    if (logoutBtnMobile) {
      logoutBtnMobile.onclick = () => {
        logout();
        window.location.href = '/';
      };
    }
  }
} 