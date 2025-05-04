import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/2-snackbar.css';

const refs = {
  formEl: document.querySelector('.form'),
  delayField: document.querySelector('input[name="delay"]'),
  // formButton: document.querySelector('button[type="submit"]'),
};

// Вешаем на форму слушатель события
refs.formEl.addEventListener('submit', onFormSubmit);

// Функция создания промиса в аргумены, которой передаём delay - время задержки setTimeout
function makePromise(delay) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (refs.formEl.elements['state'].value === 'fulfilled') {
        res(`✅ Fulfilled promise in ${delay}ms`);
      } else {
        rej(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  });
}

// Функция - оброботчик слушателя события на форме
function onFormSubmit(evt) {
  evt.preventDefault();

  // Вызов функции промиса
  makePromise(Number(refs.delayField.value))
    .then(message => {
      iziToastOptions(
        `✅ Fulfilled promise in ${refs.delayField.value}ms`,
        'green'
      );
    })
    .catch(message => {
      iziToastOptions(
        `❌ Rejected promise in ${refs.delayField.value}ms`,
        'red'
      );
    })
    .finally(() => {
      refs.formEl.reset();
    });
}

// Опции подключенного через библиотеку alert
function iziToastOptions(message, backgroundColor) {
  return iziToast.show({
    message,
    messageColor: '#ffffff',
    backgroundColor,
    icon: 'fa-regular fa-circle-xmark',
    iconColor: '#a22b2b',
    position: 'topRight',
  });
}
