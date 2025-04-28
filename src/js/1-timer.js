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

// Переменные для хранения localStorage ключей
const STORAGE_INPUT_KEY = 'feedback-input-state';
const STORAGE_INTERVAL_KEY = 'feedback-interval-state';

// Переменная для хранения выбранной даты
let userSelectedDate;

//Переменную для хранения setInterval
let intervalId;

// Переменная для хранения разницы между выбранной и текущей датами
let timeLeft;

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

      // Если выбранная дата меньше текущей показываем alert
      iziToastOptions();
    } else {
      // Сохраняем выбранную дату во внешнюю переменную
      userSelectedDate = selectedDates[0];
      // Вешаем слушатель события на кнопку Start
      refs.buttonStart.addEventListener('click', onStartClick);
      // Вешаем на кнопку Start класс isActive
      refs.buttonStart.classList.add('isActive');
    }
    // Вешаем слушатель события на кнопку Clear
    refs.buttonClear.addEventListener('click', onClearClick);
    //  Вешаем на кнопку Clear класс isActive
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

// Функция создания интервала
const startInterval = () => {
  intervalId = setInterval(() => {
    timeLeft = convertMs(userSelectedDate - new Date());

    refs.fieldDays.textContent = addLeadingZero(timeLeft.days);
    refs.fieldHours.textContent = addLeadingZero(timeLeft.hours);
    refs.fieldMinutes.textContent = addLeadingZero(timeLeft.minutes);
    refs.fieldSeconds.textContent = addLeadingZero(timeLeft.seconds);

    // Если счетчик дошёл до нуля - удаляется интервал
    if (
      timeLeft.days <= 0 &&
      timeLeft.hours <= 0 &&
      timeLeft.minutes <= 0 &&
      timeLeft.seconds <= 0
    ) {
      clearInterval(intervalId);
      localStorage.removeItem(STORAGE_INPUT_KEY);
      localStorage.removeItem(STORAGE_INTERVAL_KEY);

      refs.buttonStart.removeEventListener('click', onStopClick);
      refs.buttonStart.textContent = 'Start';
      refs.buttonStart.classList.remove('isActive');
      refs.dataInput.removeAttribute('disabled');
      refs.dataInput.classList.remove('inputDisabled');
    }
  }, 1000);
};

//Вызов функции возвращения данных из localStorage
populateInput();

// Обновляем в Input дату каждую минуту
setInterval(() => {
  fp.setDate(new Date(), true);
}, 60000);

// Функция обработчика слушателя событий кнопки Start
function onStartClick() {
  localStorage.setItem(STORAGE_INPUT_KEY, userSelectedDate);
  localStorage.removeItem(STORAGE_INTERVAL_KEY);

  refs.buttonStart.removeEventListener('click', onStartClick);
  refs.buttonClear.removeEventListener('click', onClearClick);
  refs.buttonStart.addEventListener('click', onStopClick);
  refs.buttonStart.textContent = 'Stop';
  refs.buttonClear.classList.remove('isActive');
  refs.dataInput.setAttribute('disabled', true);
  refs.dataInput.classList.add('inputDisabled');

  startInterval();
}

// Функция обработчика слушателя событий кнопки Stop
function onStopClick() {
  localStorage.setItem(STORAGE_INTERVAL_KEY, 'true');

  clearInterval(intervalId);
  intervalId = null;

  refs.buttonStart.addEventListener('click', onStartClick);
  refs.buttonClear.addEventListener('click', onClearClick);
  refs.buttonStart.textContent = 'Start';
  refs.buttonClear.classList.add('isActive');
  refs.dataInput.removeAttribute('disabled');
  refs.dataInput.classList.remove('inputDisabled');
}

// Функция обработчика слушателя событий кнопки Clear
function onClearClick() {
  userSelectedDate = null;
  fp.setDate(new Date());

  localStorage.removeItem(STORAGE_INPUT_KEY);
  localStorage.removeItem(STORAGE_INTERVAL_KEY);

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

// Функция возвращения данных из localStorage
function populateInput() {
  const savedDate = localStorage.getItem(STORAGE_INPUT_KEY);
  const intervalStopped = localStorage.getItem(STORAGE_INTERVAL_KEY);

  if (savedDate) {
    const parsedDate = new Date(savedDate);
    fp.setDate(parsedDate);
    userSelectedDate = parsedDate;

    if (intervalStopped !== 'true') {
      startInterval();
      refs.buttonStart.addEventListener('click', onStopClick);
      refs.buttonStart.textContent = 'Stop';
      refs.dataInput.setAttribute('disabled', true);
      refs.dataInput.classList.add('inputDisabled');

      timeLeft = convertMs(userSelectedDate - new Date());
      refs.fieldDays.textContent = addLeadingZero(timeLeft.days);
      refs.fieldHours.textContent = addLeadingZero(timeLeft.hours);
      refs.fieldMinutes.textContent = addLeadingZero(timeLeft.minutes);
      refs.fieldSeconds.textContent = addLeadingZero(timeLeft.seconds);
    } else {
      refs.buttonStart.removeEventListener('click', onStopClick);
      refs.buttonStart.addEventListener('click', onStartClick);
      refs.buttonStart.textContent = 'Start';
      refs.buttonClear.addEventListener('click', onClearClick);
      refs.buttonClear.classList.add('isActive');
      refs.dataInput.removeAttribute('disabled');
      refs.dataInput.classList.remove('inputDisabled');

      timeLeft = convertMs(userSelectedDate - new Date());
      refs.fieldDays.textContent = addLeadingZero(timeLeft.days);
      refs.fieldHours.textContent = addLeadingZero(timeLeft.hours);
      refs.fieldMinutes.textContent = addLeadingZero(timeLeft.minutes);
      refs.fieldSeconds.textContent = addLeadingZero(timeLeft.seconds);
    }

    refs.buttonStart.classList.add('isActive');
  }
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
