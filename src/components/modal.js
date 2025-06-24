export function showModal(message) {
  // Fjern eksisterende modal hvis den finnes
  const existing = document.getElementById('modal-root');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-root';
  modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40';
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
      <div class="mb-4 text-red-600 text-lg font-semibold">${message}</div>
      <button id="closeModal" class="mt-2 px-6 py-2 bg-accent text-white rounded-full hover:bg-secondary transition">OK</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('closeModal').onclick = () => modal.remove();
  // Lukk med Escape
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.remove();
  });
  modal.tabIndex = -1;
  modal.focus();
} 