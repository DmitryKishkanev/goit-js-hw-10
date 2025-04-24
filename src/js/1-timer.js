import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../css/1-timer.css';

const refs = {
  dataInput: document.querySelector('#datetime-picker'),
  buttonStart: document.querySelector('[data-start]'),
  buttonClear: document.querySelector('[data-clear]'),
  fieldDays: document.querySelector('[data-days]'),
  fieldHours: document.querySelector('[data-hours]'),
  fieldMinutes: document.querySelector('[data-minutes]'),
  fieldSeconds: document.querySelector('[data-seconds]'),
};

// Переменная для хранения localStorage ключа
const STORAGE_KEY = 'feedback-input-state';

// Переменная для хранения выбранной даты
let userSelectedDate;

//Переменную для хранения setInterval
let intervalId;

// Необязательный объект параметров функции flatpickr
const options = {
  dateFormat: 'd-m-Y H:i',
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      refs.buttonStart.classList.remove('isActive');

      iziToastOptions();
    } else {
      // Вешаем слушатель события на кнопку Start
      // localStorage.setItem(STORAGE_KEY, selectedDates[0]);
      refs.buttonStart.addEventListener('click', onStartClick);
      refs.buttonStart.classList.add('isActive');
    }
    userSelectedDate = selectedDates[0];

    refs.buttonClear.addEventListener('click', onClearClick);
    refs.buttonClear.classList.add('isActive');
  },
};

// Опции подключенного через библиотеку alert
function iziToastOptions() {
  return iziToast.show({
    message: 'Please choose a date in the future',
    messageColor: '#ffffff',
    backgroundColor: '#ff0000',
    icon: 'fa-regular fa-circle-xmark',
    iconColor: '#a22b2b',
    position: 'topRight',
  });
}

// Сохраняем в переменную результат вызова экземпляра flatpickr
const fp = flatpickr(refs.dataInput, options);

// const savedDate = JSON.parse(localStorage.getItem(STORAGE_KEY));
const savedDate = localStorage.getItem(STORAGE_KEY);

const startInterval = () => {
  intervalId = setInterval(() => {
    const timeLeft = convertMs(userSelectedDate - new Date());

    refs.fieldDays.textContent = addLeadingZero(timeLeft.days);
    refs.fieldHours.textContent = addLeadingZero(timeLeft.hours);
    refs.fieldMinutes.textContent = addLeadingZero(timeLeft.minutes);
    refs.fieldSeconds.textContent = addLeadingZero(timeLeft.seconds);
  }, 1000);
};

const intervalStopped = localStorage.getItem('intervalStopped');

if (savedDate && intervalStopped !== 'true') {
  const parsedDate = new Date(savedDate);
  fp.setDate(parsedDate);
  userSelectedDate = parsedDate;

  startInterval();

  if (!intervalId) {
    refs.buttonStart.addEventListener('click', onStartClick);
    refs.buttonClear.addEventListener('click', onClearClick);
    refs.buttonStart.classList.add('isActive');
    refs.buttonClear.classList.add('isActive');
  } else {
    refs.buttonStart.removeEventListener('click', onStartClick);
    refs.buttonClear.removeEventListener('click', onClearClick);
    refs.buttonStart.classList.remove('isActive');
    refs.buttonClear.classList.remove('isActive');
    refs.buttonStart.addEventListener('click', onStopClick);
    refs.buttonStart.classList.add('isActive');
    refs.buttonStart.textContent = 'Stop';
    refs.dataInput.setAttribute('disabled', true);
    refs.dataInput.classList.add('inputDisabled');
  }
}

// Обновляем в Input дату каждую минуту
setInterval(() => {
  fp.setDate(new Date(), true);
}, 60000);

// Функция обработчика слушателя событий кнопки Start
function onStartClick() {
  localStorage.setItem(STORAGE_KEY, userSelectedDate);

  refs.buttonStart.removeEventListener('click', onStartClick);
  refs.buttonStart.addEventListener('click', onStopClick);
  refs.buttonStart.textContent = 'Stop';
  refs.buttonClear.removeEventListener('click', onClearClick);
  refs.buttonClear.classList.remove('isActive');
  refs.dataInput.setAttribute('disabled', true);
  refs.dataInput.classList.add('inputDisabled');

  startInterval();

  // const startInterval = () => {
  //   intervalId = setInterval(() => {
  //     const timeLeft = convertMs(userSelectedDate - new Date());

  //     refs.fieldDays.textContent = addLeadingZero(timeLeft.days);
  //     refs.fieldHours.textContent = addLeadingZero(timeLeft.hours);
  //     refs.fieldMinutes.textContent = addLeadingZero(timeLeft.minutes);
  //     refs.fieldSeconds.textContent = addLeadingZero(timeLeft.seconds);
  //   }, 1000);
  // };
}

// Функция обработчика слушателя событий кнопки Stop
function onStopClick() {
  clearInterval(intervalId);
  intervalId = null;

  localStorage.setItem('intervalStopped', 'true');

  refs.buttonStart.addEventListener('click', onStartClick);
  refs.buttonStart.textContent = 'Start';
  refs.buttonClear.addEventListener('click', onClearClick);
  refs.buttonClear.classList.add('isActive');
  refs.dataInput.removeAttribute('disabled');
  refs.dataInput.classList.remove('inputDisabled');
}

// Функция обработчика слушателя событий кнопки Clear
function onClearClick() {
  userSelectedDate = null;
  fp.setDate(new Date());
  localStorage.removeItem(STORAGE_KEY);
  refs.buttonClear.removeEventListener('click', onClearClick);
  refs.buttonStart.removeEventListener('click', onStartClick);
  refs.buttonStart.removeEventListener('click', onStopClick);
  refs.buttonClear.classList.remove('isActive');
  refs.buttonStart.classList.remove('isActive');
  refs.fieldDays.textContent = addLeadingZero('0');
  refs.fieldHours.textContent = addLeadingZero('0');
  refs.fieldMinutes.textContent = addLeadingZero('0');
  refs.fieldSeconds.textContent = addLeadingZero('0');
}

function populateInput() {
  // const savedInput = JSON.parse(localStorage.getItem(STORAGE_KEY));
  // if (savedInput) {
  //   const parsedDate = new Date(savedInput);
  //   fp.setDate(parsedDate);
  //   refs.dataInput.value = parsedDate.toLocaleString();
  // }
  // const savedDate = localStorage.getItem(STORAGE_KEY);
  // if (savedDate) {
  //   // Парсим дату из строки и устанавливаем её как defaultDate
  //   const parsedDate = new Date(JSON.parse(savedDate));
  //   fp.setDate(parsedDate); // Устанавливаем дату в flatpickr
  //   refs.dataInput.value = parsedDate.toLocaleString();
  // }
}

// Добавляем нуль слева к значениям отображающихся таймером
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
// Функция для подсчёта значения времени, где ms разница между конечной и текущей датой в миллисекундах
function convertMs(ms) {
  // Количество миллисекунд в единице времени
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Оставшиеся дни
  const days = Math.floor(ms / day);
  // Оставшиеся часы
  const hours = Math.floor((ms % day) / hour);
  // Оставшиеся минуты
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Оставшиеся секунды
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
