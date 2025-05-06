import '../css/3-color-switcher.css';

// const refs = {
//   buttonStart: document.querySelector('[data-start]'),
//   buttonStop: document.querySelector('[ data-stop]'),
//   bodyStyle: document.body.style,
//   originalBgImage: 'url("../img/timer.jpg")',
// };

// let intervalId;

// refs.buttonStart.addEventListener('click', onStartClick);

// const startInterval = () => {
//   intervalId = setInterval(() => {
//     refs.bodyStyle.backgroundImage = 'none';
//     refs.bodyStyle.backgroundColor = getRandomHexColor();
//   }, 1000);
// };

// if (!intervalId) {
//   refs.buttonStart.classList.add('isActive');
//   refs.bodyStyle.backgroundImage = refs.originalBgImage;
// }

// function onStartClick() {
//   startInterval();

//   refs.buttonStop.addEventListener('click', onStopClick);
//   refs.buttonStart.removeEventListener('click', onStartClick);
//   refs.buttonStart.setAttribute('disabled', true);
//   refs.buttonStop.removeAttribute('disabled');
//   refs.buttonStart.classList.remove('isActive');
//   refs.buttonStop.classList.add('isActive');
// }

// function onStopClick() {
//   clearInterval(intervalId);
//   intervalId = null;

//   refs.buttonStop.removeEventListener('click', onStopClick);
//   refs.buttonStart.addEventListener('click', onStartClick);
//   refs.buttonStart.removeAttribute('disabled');
//   refs.buttonStop.setAttribute('disabled', true);
//   refs.buttonStart.classList.add('isActive');
//   refs.buttonStop.classList.remove('isActive');
// }

// function getRandomHexColor() {
//   return `#${Math.floor(Math.random() * 16777215)
//     .toString(16)
//     .padStart(6, 0)}`;
// }

const refs = {
  buttonStart: document.querySelector('[data-start]'),
  buttonClear: document.querySelector('[ data-clear]'),
  bodyStyle: document.body.style,
  originalBgImage: 'url("../../src/img/timer.jpg")',
};

// Переменные для хранения localStorage ключей
const STORAGE_COLOR_KEY = 'feedback-color-state';
const STORAGE_INTERVAL_KEY = 'feedback-interval-state';

//Переменную для хранения setInterval
let intervalId;

// Вешаем слушатель события на кнопку Start
refs.buttonStart.addEventListener('click', onStartClick);

// Функция создания интервала
const startInterval = () => {
  intervalId = setInterval(() => {
    refs.bodyStyle.backgroundImage = 'none';

    let preservedСolor = getRandomHexColor();
    refs.bodyStyle.backgroundColor = preservedСolor;
    localStorage.setItem(STORAGE_COLOR_KEY, preservedСolor);
  }, 1000);
};

//Вызов функции возвращения данных из localStorage
populateColor();

// Функция обработчика слушателя событий кнопки Start
function onStartClick() {
  //   localStorage.setItem(STORAGE_COLOR_KEY, preservedСolor);
  localStorage.removeItem(STORAGE_INTERVAL_KEY);

  refs.buttonStart.removeEventListener('click', onStartClick);
  refs.buttonClear.removeEventListener('click', onClearClick);
  refs.buttonStart.addEventListener('click', onStopClick);

  refs.buttonStart.textContent = 'Stop';
  refs.buttonClear.setAttribute('disabled', true);
  refs.buttonClear.classList.remove('isActive');

  startInterval();
}

// Функция обработчика слушателя событий кнопки Stop
function onStopClick() {
  localStorage.setItem(STORAGE_INTERVAL_KEY, 'true');

  clearInterval(intervalId);
  intervalId = null;

  refs.buttonStart.removeEventListener('click', onStopClick);
  refs.buttonStart.addEventListener('click', onStartClick);
  refs.buttonClear.addEventListener('click', onClearClick);

  refs.buttonStart.textContent = 'Start';
  refs.buttonClear.removeAttribute('disabled');
  refs.buttonClear.classList.add('isActive');
}

// Функция обработчика слушателя событий кнопки Clear
function onClearClick() {
  localStorage.removeItem(STORAGE_COLOR_KEY);
  localStorage.removeItem(STORAGE_INTERVAL_KEY);

  refs.buttonClear.setAttribute('disabled', true);
  refs.buttonClear.classList.remove('isActive');

  refs.bodyStyle.backgroundImage = refs.originalBgImage;
}

// Функция возвращения данных из localStorage
function populateColor() {
  const savedColor = localStorage.getItem(STORAGE_COLOR_KEY);
  const intervalStopped = localStorage.getItem(STORAGE_INTERVAL_KEY);

  if (savedColor) {
    refs.bodyStyle.backgroundColor = savedColor;

    if (intervalStopped !== 'true') {
      startInterval();
      refs.buttonStart.removeEventListener('click', onStartClick);
      refs.buttonStart.addEventListener('click', onStopClick);
      refs.buttonStart.textContent = 'Stop';
    } else {
      refs.buttonStart.removeEventListener('click', onStopClick);
      refs.buttonStart.addEventListener('click', onStartClick);
      refs.buttonStart.textContent = 'Start';
      refs.buttonClear.addEventListener('click', onClearClick);
      refs.buttonClear.classList.add('isActive');
    }

    refs.buttonStart.classList.add('isActive');
  } else {
    refs.buttonStart.classList.add('isActive');
    refs.bodyStyle.backgroundImage = refs.originalBgImage;
  }
}

// Функция генерации случайного цвета
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
