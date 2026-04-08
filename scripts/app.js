const user = document.getElementById('user');
const pass = document.getElementById('pass');
const loginBtn = document.getElementById('loginBtn');
const status = document.getElementById('status');

const login = document.getElementById('login');
const chat = document.getElementById('chat');
const letter = document.getElementById('letter');

const openMessage = document.getElementById('openMessage');
const textEl = document.getElementById('text');

const pauseBtn = document.getElementById('pause');
const resumeBtn = document.getElementById('resume');
const rewindBtn = document.getElementById('rewind');
const exitBtn = document.getElementById('exit');

const VALID_USER = 'Camila';
const KEYS = ['73194','48216','90527','16483','52891'];

loginBtn.onclick = () => {
  if (user.value === VALID_USER && KEYS.includes(pass.value)) {
    login.classList.add('hidden');
    chat.classList.remove('hidden');
  } else {
    status.textContent = 'Credenciales inválidas';
  }
};

openMessage.onclick = () => {
  chat.classList.add('hidden');
  letter.classList.remove('hidden');
  startLetter();
};

let paused = false;
let i = 0;
let page = 0;

const pages = [
`Hola Camila...

Feliz cumpleaños. De verdad espero que hoy la estés pasando bien, aunque sea un poquito más especial que cualquier otro día.`,

`Después de todo, este es TU día. Uno de esos pocos en los que todo debería girar un poco más a tu alrededor.`,

`Aunque todavía no nos conocemos tanto, puedo decir que eres una buena persona.`,

`Y honestamente, me alegra haberte conocido.`,

`Ojalá este año te traiga momentos que valgan la pena recordar.`,

`Con cariño,
Neo`
];

function type() {
  if (paused) return;

  if (i < pages[page].length) {
    const span = document.createElement('span');
    span.textContent = pages[page][i];
    textEl.appendChild(span);

    i++;
    setTimeout(type, 28);
  } else {
    setTimeout(nextPage, 2000);
  }
}

function nextPage() {
  textEl.innerHTML = '';
  i = 0;
  page++;

  if (page >= pages.length) {
    textEl.innerHTML = '<< REBOBINAR >>';
    return;
  }

  type();
}

function startLetter() {
  textEl.innerHTML = '';
  i = 0;
  page = 0;
  type();
}

pauseBtn.onclick = () => paused = true;
resumeBtn.onclick = () => { paused = false; type(); };
rewindBtn.onclick = startLetter;

exitBtn.onclick = () => {
  letter.classList.add('hidden');
  login.classList.remove('hidden');
};
