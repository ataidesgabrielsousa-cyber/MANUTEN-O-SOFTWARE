// ── Seletores ──────────────────────────────────────────────
const img            = document.getElementById('cat-img');
const skeleton       = document.getElementById('skeleton');
const statusText     = document.getElementById('status-text');
const counter        = document.getElementById('counter');
const btnFetch       = document.getElementById('btn-fetch');
const btnIcon        = document.getElementById('btn-icon');
const btnOpen        = document.getElementById('btn-open');
const historySection = document.getElementById('history-section');
const historyGrid    = document.getElementById('history-grid');

// ── Estado ─────────────────────────────────────────────────
let count      = 0;
let currentUrl = '';
const historyUrls = [];

// ── Funções ─────────────────────────────────────────────────

/**
 * Busca uma imagem aleatória de gato na Cataas API
 * e atualiza a interface.
 */
function fetchCat() {
  // Desabilita o botão e mostra spinner
  btnFetch.disabled = true;
  btnIcon.className = 'spin';
  btnIcon.textContent = '◌';
  statusText.textContent = 'buscando…';

  // Reseta a imagem atual
  img.classList.remove('visible');
  skeleton.classList.remove('hidden');
  skeleton.textContent = '🐾';

  // Monta URL com cache-bust para garantir imagem diferente a cada chamada
  const url = `https://cataas.com/cat?t=${Date.now()}`;
  currentUrl = url;

  // Pré-carrega a imagem antes de exibir
  const tmp = new Image();

  tmp.onload = () => onImageLoaded(url);
  tmp.onerror = onImageError;
  tmp.src = url;
}

/**
 * Chamado quando a imagem carregou com sucesso.
 * @param {string} url - URL da imagem carregada
 */
function onImageLoaded(url) {
  img.src = url;
  img.classList.add('visible');
  skeleton.classList.add('hidden');

  count++;
  counter.textContent = count + (count === 1 ? ' foto' : ' fotos');
  statusText.textContent = 'imagem carregada ✓';

  btnOpen.disabled = false;
  btnFetch.disabled = false;
  btnIcon.className = '';
  btnIcon.textContent = '✦';

  addToHistory(url);
}

/**
 * Chamado quando ocorre erro ao carregar a imagem.
 */
function onImageError() {
  skeleton.textContent = '😿';
  statusText.textContent = 'erro ao carregar';

  btnFetch.disabled = false;
  btnIcon.className = '';
  btnIcon.textContent = '✦';
}

/**
 * Abre a imagem atual em uma nova aba.
 */
function openCurrent() {
  if (currentUrl) {
    window.open(currentUrl, '_blank');
  }
}

/**
 * Adiciona uma URL ao histórico e re-renderiza o grid.
 * Mantém no máximo 8 entradas.
 * @param {string} url - URL a adicionar
 */
function addToHistory(url) {
  historyUrls.unshift(url);

  if (historyUrls.length > 8) {
    historyUrls.pop();
  }

  historySection.style.display = 'block';

  historyGrid.innerHTML = historyUrls
    .map(u => `
      <div class="history-thumb" onclick="window.open('${u}', '_blank')">
        <img src="${u}" alt="histórico" loading="lazy" />
      </div>
    `)
    .join('');
}

// ── Event Listeners ─────────────────────────────────────────
btnFetch.addEventListener('click', fetchCat);
btnOpen.addEventListener('click', openCurrent);

// ── Inicialização ────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(fetchCat, 300);
});
