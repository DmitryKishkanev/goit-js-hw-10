import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../css/1-timer.css';

const buttonStart = document.querySelector('[data-start]');

let userSelectedDate = '';
const defaultDate = new Date();

const options = {
  dateFormat: 'd-m-Y H:i',
  enableTime: true,
  time_24hr: true,
  defaultDate: defaultDate,
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < defaultDate) {
      buttonStart.classList.remove('isActive');
      return window.alert('Please choose a date in the future');
    }
    userSelectedDate = selectedDates[0];
    buttonStart.classList.add('isActive');

    console.log(userSelectedDate);
  },
};

const fp = flatpickr('#datetime-picker', options);
