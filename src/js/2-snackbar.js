import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/2-snackbar.css';

const refs = {
  formEl: document.querySelector('.form'),
  delayField: document.querySelector('input[name="delay"]'),
  //   submitButton: document.querySelector('button[type="submit"]'),
};

refs.formEl.addEventListener('submit', onFormSubmit);
// refs.submitButton.addEventListener('click', onSubmitClick);

// function onSubmitClick() {
//   makePromise(Number(refs.delayField.value))
//     .then(message => {
//       iziToastOptions(
//         `✅ Fulfilled promise in ${refs.delayField.value}ms`,
//         'green'
//       );
//     })
//     .catch(message => {
//       iziToastOptions(
//         `❌ Rejected promise in ${refs.delayField.value}ms`,
//         'red'
//       );
//     });
// }

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

function onFormSubmit(evt) {
  evt.preventDefault();

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
    });
}

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
