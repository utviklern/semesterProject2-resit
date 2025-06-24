// Enkel hash-router for SPA

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
  } else if (hash.startsWith('#/pet/edit/')) {
    const id = hash.split('/')[3];
    renderPetEdit(id);
  } else if (hash.startsWith('#/pet/')) {
    const id = hash.split('/')[2];
    renderPetDetail(id);
  } else if (hash === '#/pet/create') {
    renderPetCreate();
  } else if (hash === '#/account/login') {
    renderLogin();
  } else if (hash === '#/account/register') {
    renderRegister();
  } else {
    document.getElementById('app').innerHTML = '<h1 class="text-2xl">404 Not Found</h1>';
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  router();
}); 