import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/2-snackbar.css';

const refs = {
  formEl: document.querySelector('.form'),
  delayField: document.querySelector('input[name="delay"]'),
  stateField: document.querySelectorAll('input[name="state"]'),
  formCreateButton: document.querySelector('button[type="submit"]'),
  formClearButton: document.querySelector('button[type="button"]'),
};

// Вешаем слушатели события
refs.formEl.addEventListener('submit', onFormSubmit);
refs.delayField.addEventListener('input', checkFields);
refs.formClearButton.addEventListener('click', onformClearButton);
refs.stateField.forEach(radio => {
  radio.addEventListener('change', checkFields);
});

function checkFields() {
  const selectedRadio = document.querySelector('input[name="state"]:checked');

  if (selectedRadio && refs.delayField.value !== '') {
    refs.formCreateButton.classList.add('isActive');
    refs.formClearButton.classList.add('isActive');
  } else {
    refs.formCreateButton.classList.remove('isActive');
    refs.formClearButton.classList.remove('isActive');
  }
}

function onformClearButton() {
  refs.formEl.reset();
  refs.formCreateButton.classList.remove('isActive');
  refs.formClearButton.classList.remove('isActive');
}

// Функция создания промиса в аргумены, которой передаём delay - время задержки setTimeout
function makePromise(delay) {
  const selectedRadio = document.querySelector('input[name="state"]:checked');

  return new Promise((res, rej) => {
    setTimeout(() => {
      if (selectedRadio.value === 'fulfilled') {
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
      refs.formCreateButton.classList.remove('isActive');
      refs.formClearButton.classList.remove('isActive');
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
