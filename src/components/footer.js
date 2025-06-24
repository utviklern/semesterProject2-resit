export function renderFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;
  root.innerHTML = `
    <footer class="bg-light py-8 mt-20 w-full">
      <div class="max-w-4xl mx-auto text-center font-roboto">
        <h2 class="text-2xl font-poppins mb-4">Contact us</h2>
        <div class="flex flex-col md:flex-row justify-between items-center gap-2 px-4 max-w-md mx-auto">
          <span class="text-base md:text-lg">55321229</span>
          <span class="text-base md:text-lg">pets@petlify.no</span>
        </div>
      </div>
    </footer>
  `;
} 