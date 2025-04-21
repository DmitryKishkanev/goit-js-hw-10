import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../css/1-timer.css';

const buttonStart = document.querySelector('[data-start]');
const fieldDays = document.querySelector('[data-days]');
const fieldHours = document.querySelector('[data-hours]');
const fieldMinutes = document.querySelector('[data-minutes]');
const fieldSeconds = document.querySelector('[data-seconds]');

buttonStart.addEventListener('click', onClick);

let userSelectedDate = '';

const options = {
  dateFormat: 'd-m-Y H:i',
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      buttonStart.classList.remove('isActive');

      iziToast.show({
        message: 'Please choose a date in the future',
        messageColor: '#ffffff',
        backgroundColor: '#ff0000',
        icon: 'fa-regular fa-circle-xmark',
        iconColor: '#a22b2b',
        position: 'topRight',
      });
    }

    userSelectedDate = selectedDates[0];
    buttonStart.classList.add('isActive');

    console.log(userSelectedDate);
  },
};

const fp = flatpickr('#datetime-picker', options);

function onClick() {
  return setInterval(() => {
    const timeLeft = convertMs(userSelectedDate - new Date());
    fieldDays.textContent = addLeadingZero(timeLeft.days);
    fieldHours.textContent = addLeadingZero(timeLeft.hours);
    fieldMinutes.textContent = addLeadingZero(timeLeft.minutes);
    fieldSeconds.textContent = addLeadingZero(timeLeft.seconds);
  }, 1000);
}

// Добавляем нуль слева к значениям отображающихся таймером
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
