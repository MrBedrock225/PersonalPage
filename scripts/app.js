const VALID_USER = 'Camila';
const KEYS = ['73194','48216','90527','16483','52891'];

const login = document.getElementById('login');
const chat = document.getElementById('chat');
const letter = document.getElementById('letter');
const textEl = document.getElementById('text');
const status = document.getElementById('status');

const pages = [
`Hola Camila...

Feliz cumpleaños. De verdad espero que hoy la estés pasando bien, aunque sea un poquito más especial que cualquier otro día.`,

`Después de todo, este es TU día. Uno de esos pocos en los que todo debería girar un poco más a tu alrededor.`,

`Aunque todavía no nos conocemos tanto, puedo decir que eres una buena persona, y honestamente me alegra haberte conocido.`,

`Con cariño,
Neo`
];

let paused = false;
let i = 0;
let page = 0;

document.getElementById('loginBtn').onclick = () => {
  const user = document.getElementById('user').value.trim();
  const pass = document.getElementById('pass').value.trim();

  if (user === VALID_USER && KEYS.includes(pass)) {
    login.classList.add('hidden');
    chat.classList.remove('hidden');
  } else {
    status.textContent = 'Credenciales inválidas';
  }
};

document.getElementById('openMessage').onclick = () => {
  chat.classList.add('hidden');
  letter.classList.remove('hidden');
  startLetter();
};

function type() {
  if (paused) return;

  if (i < pages[page].length) {
    const span = document.createElement('span');
    span.textContent = pages[page][i];
    textEl.appendChild(span);
    i++;
    setTimeout(type, 28);
  } else {
    setTimeout(nextPage, 2200);
  }
}

function nextPage() {
  textEl.innerHTML = '';
  i = 0;
  page++;

  if (page >= pages.length) {
    textEl.textContent = '<< REBOBINAR >>';
    return;
  }

  type();
}

function startLetter() {
  textEl.innerHTML = '';
  i = 0;
  page = 0;
  paused = false;
  type();
}

document.getElementById('pause').onclick = () => paused = true;
document.getElementById('resume').onclick = () => {
  paused = false;
  type();
};
document.getElementById('rewind').onclick = startLetter;

document.getElementById('exit').onclick = () => {
  letter.classList.add('hidden');
  login.classList.remove('hidden');
};
