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

// Переменная для хранения выбранной даты
let userSelectedDate = '';

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
      refs.buttonStart.addEventListener('click', onStartClick);
      refs.buttonStart.classList.add('isActive');
    }
    userSelectedDate = selectedDates[0];
    refs.buttonClear.addEventListener('click', onClearClick);
    refs.buttonClear.classList.add('isActive');
    // console.log(userSelectedDate);
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

// Обновляем в Input дату каждую минуту
setInterval(() => {
  fp.setDate(new Date(), true);
}, 60000);

//Переменную для хранения setInterval
let intervalId;

// Функция обработчика слушателя событий кнопки Start
function onStartClick() {
  refs.buttonStart.removeEventListener('click', onStartClick);
  refs.buttonStart.addEventListener('click', onStopClick);
  refs.buttonStart.textContent = 'Stop';
  refs.buttonClear.removeEventListener('click', onClearClick);
  refs.buttonClear.classList.remove('isActive');
  refs.dataInput.setAttribute('disabled', true);
  refs.dataInput.classList.add('inputDisabled');

  intervalId = setInterval(() => {
    const timeLeft = convertMs(userSelectedDate - new Date());
    refs.fieldDays.textContent = addLeadingZero(timeLeft.days);
    refs.fieldHours.textContent = addLeadingZero(timeLeft.hours);
    refs.fieldMinutes.textContent = addLeadingZero(timeLeft.minutes);
    refs.fieldSeconds.textContent = addLeadingZero(timeLeft.seconds);
  }, 1000);
}

function onStopClick() {
  clearInterval(intervalId);
  refs.buttonStart.addEventListener('click', onStartClick);
  refs.buttonStart.textContent = 'Start';
  refs.buttonClear.addEventListener('click', onClearClick);
  refs.buttonClear.classList.add('isActive');
  refs.dataInput.removeAttribute('disabled');
  refs.dataInput.classList.remove('inputDisabled');
}

function onClearClick() {
  userSelectedDate = null;
  fp.setDate(new Date(), true);
  refs.buttonStart.removeEventListener('click', onStartClick);
  refs.buttonStart.classList.remove('isActive');
  refs.fieldDays.textContent = addLeadingZero('0');
  refs.fieldHours.textContent = addLeadingZero('0');
  refs.fieldMinutes.textContent = addLeadingZero('0');
  refs.fieldSeconds.textContent = addLeadingZero('0');
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
