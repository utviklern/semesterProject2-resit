// simple hash router for SPA

import { renderNavbar } from './navbar.js';
import { renderFooter } from './footer.js';
import { renderLogin } from '../views/login.js';
import { renderRegister } from '../views/register.js';
import { renderPetList } from '../views/petList.js';
import { renderPetDetail } from '../views/petDetail.js';
import { renderPetCreate } from '../views/petCreate.js';
import { renderPetEdit } from '../views/petEdit.js';
import { renderProfile } from '../views/profile.js';

function router() {
  const hash = window.location.hash || '#/';

  if (hash === '#/' || hash === '#/pets') {
    renderPetList();

  } else if (hash === '#/profile') {
    renderProfile();

  } else if (hash === '#/pet/create') {
    renderPetCreate();

  } else if (hash.startsWith('#/pet/edit/')) {
    const parts = hash.split('/');
    const id = parts[3];
    if (id) {
      renderPetEdit(id);
    } else {
      show404();
    }

  } else if (hash.startsWith('#/pet/')) {
    const parts = hash.split('/');
    const id = parts[2];
    if (id) {
      renderPetDetail(id);
    } else {
      show404();
    }

  } else if (hash === '#/account/login') {
    renderLogin();

  } else if (hash === '#/account/register') {
    renderRegister();

  } else {
    show404();
  }
}

function show404() {
  document.getElementById('app').innerHTML = `
    <div class="text-center mt-10">
      <h1 class="text-3xl font-bold">404 - Page Not Found</h1>
      <p class="mt-2"><a href="#/" class="text-accent hover:underline">Go back to home</a></p>
    </div>
  `;
}

// init
renderNavbar();
renderFooter();
router();

// listen to hash changes and page load
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
