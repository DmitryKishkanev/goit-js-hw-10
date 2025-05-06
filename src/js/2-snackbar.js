import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/2-snackbar.css';

const refs = {
  formEl: document.querySelector('.form'),
  formCreateButton: document.querySelector('button[type="submit"]'),
  formClearButton: document.querySelector('button[type="button"]'),
};

// Переменная для хранения localStorage ключа
const STORAGE_KEY = 'feedback-form-state';

// Создаём объект с пустыми свойствами для записи данных и сохранения его в localStorage
const formData = {
  delay: '',
  state: '',
};

// Вешаем слушатели события
refs.formEl.addEventListener('input', onInput);
refs.formEl.addEventListener('submit', onFormSubmit);
refs.formClearButton.addEventListener('click', onFormClearButton);

// Вызов функции записи данных в форму из localStorage и передача ему аргументом нашей формы
populateForm(refs.formEl);

function onInput(evt) {
  const { name, value } = evt.target;
  formData[name] = value;

  // Проверяем, есть ли хотябы одно поле, значение которого не пустое
  const hasData = Object.values(formData).some(field => field !== '');

  if (hasData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    refs.formCreateButton.classList.add('isActive');
    refs.formClearButton.classList.add('isActive');
  } else {
    localStorage.removeItem(STORAGE_KEY);

    refs.formCreateButton.classList.remove('isActive');
    refs.formClearButton.classList.remove('isActive');
    return;
  }
}

function onFormClearButton() {
  localStorage.removeItem(STORAGE_KEY);
  refs.formEl.reset();
  formData.delay = '';
  formData.state = '';
  refs.formCreateButton.classList.remove('isActive');
  refs.formClearButton.classList.remove('isActive');
}

// Функция создания промиса в аргумены, которой передаём delay - время задержки setTimeout
function makePromise(delay) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (formData.state === 'fulfilled') {
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
  makePromise(Number(formData.delay))
    .then(message => {
      iziToastOptions(`✅ Fulfilled promise in ${formData.delay}ms`, 'green');
    })
    .catch(message => {
      iziToastOptions(`❌ Rejected promise in ${formData.delay}ms`, 'red');
    })
    .finally(() => {
      localStorage.removeItem(STORAGE_KEY);
      refs.formEl.reset();
      formData.delay = '';
      formData.state = '';
      refs.formCreateButton.classList.remove('isActive');
      refs.formClearButton.classList.remove('isActive');
    });
}

// Функция записи данных в форму из localStorage
function populateForm(form) {
  const savedForm = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (savedForm) {
    Object.keys(savedForm).forEach(key => {
      if (form.elements[key]) {
        form.elements[key].value = savedForm[key];
        formData[key] = savedForm[key];
      }
    });

    refs.formCreateButton.classList.add('isActive');
    refs.formClearButton.classList.add('isActive');
  }
}

// Опции подключенного через библиотеку alert
function iziToastOptions(message, backgroundColor) {
  return iziToast.show({
    message,
    messageColor: '#ffffff',
    backgroundColor,
    position: 'topRight',
    timeout: 50000,
  });
}
