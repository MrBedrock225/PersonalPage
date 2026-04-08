'use strict';

// ─── CONFIG ───────────────────────────────────────────
const VALID_USER = 'Camila';
const KEYS = ['73194', '48216', '90527', '16483', '52891'];
const TYPE_SPEED = 26; // ms per character
const PAGE_PAUSE = 2400; // ms between pages

const pages = [
  `Hola Camila...\n\nFeliz cumpleaños. De verdad espero que hoy la estés pasando bien, aunque sea un poquito más especial que cualquier otro día.`,
  `Después de todo, este es TU día. Uno de esos pocos en los que todo debería girar un poco más a tu alrededor.`,
  `Aunque todavía no nos conocemos tanto, puedo decir que eres una buena persona, y honestamente me alegra haberte conocido.`,
  `Con cariño,\nNeo`
];

// ─── ELEMENTS ─────────────────────────────────────────
const panelLogin  = document.getElementById('login');
const panelChat   = document.getElementById('chat');
const panelLetter = document.getElementById('letter');
const textEl      = document.getElementById('text');
const statusEl    = document.getElementById('status');
const progressFill = document.getElementById('progressFill');
const progressDot  = document.getElementById('progressDot');

// ─── STATE ────────────────────────────────────────────
let paused = false;
let charIndex = 0;
let pageIndex = 0;
let typeTimeout = null;

// ─── CLOCK ────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('clock').textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

// ─── PANEL TRANSITIONS ────────────────────────────────
function showPanel(hide, show) {
  hide.classList.add('hidden');
  hide.classList.remove('active');
  show.classList.remove('hidden');
  // force reflow for animation replay
  void show.offsetWidth;
  show.classList.add('active');
}

// ─── LOGIN ────────────────────────────────────────────
document.getElementById('loginBtn').addEventListener('click', handleLogin);
document.getElementById('pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
  const user = document.getElementById('user').value.trim();
  const pass = document.getElementById('pass').value.trim();

  if (user === VALID_USER && KEYS.includes(pass)) {
    statusEl.textContent = '';
    setTimeout(() => showPanel(panelLogin, panelChat), 120);
  } else {
    statusEl.textContent = '// ACCESO DENEGADO · CREDENCIALES INVÁLIDAS';
    statusEl.classList.remove('show');
    void statusEl.offsetWidth;
    statusEl.classList.add('show');
  }
}

// ─── OPEN MESSAGE ─────────────────────────────────────
document.getElementById('openMessage').addEventListener('click', () => {
  showPanel(panelChat, panelLetter);
  startLetter();
});

// ─── TYPING ENGINE ────────────────────────────────────
function type() {
  if (paused) return;

  const currentPage = pages[pageIndex];

  if (charIndex < currentPage.length) {
    appendChar(currentPage[charIndex]);
    charIndex++;
    updateProgress();
    typeTimeout = setTimeout(type, TYPE_SPEED + randomJitter());
  } else {
    // page done
    if (pageIndex < pages.length - 1) {
      typeTimeout = setTimeout(nextPage, PAGE_PAUSE);
    } else {
      showEnd();
    }
  }
}

function appendChar(ch) {
  // Remove blinking cursor temporarily
  const cursor = textEl.querySelector('.cursor-blink');
  if (cursor) cursor.remove();

  const span = document.createElement('span');
  span.className = 'ch' + (ch === ' ' ? ' space' : '');
  span.textContent = ch;
  textEl.appendChild(span);

  // Re-add cursor
  const cur = document.createElement('span');
  cur.className = 'cursor-blink';
  cur.textContent = '█';
  textEl.appendChild(cur);

  // Auto-scroll
  textEl.scrollTop = textEl.scrollHeight;
}

function randomJitter() {
  return Math.random() * 18 - 6; // -6 to +12ms
}

function updateProgress() {
  // Calculate total chars across all pages
  const totalChars = pages.reduce((sum, p) => sum + p.length, 0);
  const prevChars = pages.slice(0, pageIndex).reduce((sum, p) => sum + p.length, 0);
  const done = prevChars + charIndex;
  const pct = Math.min((done / totalChars) * 100, 100);

  progressFill.style.width = pct + '%';
  progressDot.style.left = pct + '%';
}

function nextPage() {
  textEl.innerHTML = '';
  charIndex = 0;
  pageIndex++;
  type();
}

function showEnd() {
  const cursor = textEl.querySelector('.cursor-blink');
  if (cursor) cursor.remove();

  progressFill.style.width = '100%';
  progressDot.style.left = '100%';

  const end = document.createElement('div');
  end.className = 'end-msg';
  end.textContent = '<< FIN DE CINTA >>';
  textEl.appendChild(end);

  // Stop reels
  panelLetter.querySelector('.panel-inner').classList.add('paused');
}

function startLetter() {
  clearTimeout(typeTimeout);
  textEl.innerHTML = '<span class="cursor-blink">█</span>';
  charIndex = 0;
  pageIndex = 0;
  paused = false;
  progressFill.style.width = '0%';
  progressDot.style.left = '0%';
  panelLetter.querySelector('.panel-inner').classList.remove('paused');
  typeTimeout = setTimeout(type, 600);
}

// ─── CONTROLS ─────────────────────────────────────────
document.getElementById('pause').addEventListener('click', () => {
  paused = true;
  clearTimeout(typeTimeout);
  panelLetter.querySelector('.panel-inner').classList.add('paused');
});

document.getElementById('resume').addEventListener('click', () => {
  if (paused) {
    paused = false;
    panelLetter.querySelector('.panel-inner').classList.remove('paused');
    type();
  }
});

document.getElementById('rewind').addEventListener('click', () => {
  clearTimeout(typeTimeout);
  startLetter();
});

document.getElementById('exit').addEventListener('click', () => {
  clearTimeout(typeTimeout);
  paused = false;
  showPanel(panelLetter, panelLogin);
});
