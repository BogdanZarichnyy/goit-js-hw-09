import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Notify.info('Background-color');

const formElement = document.querySelector('.form');
// console.log(formElement);

formElement.addEventListener('submit', setOptionsPromise);

function setOptionsPromise(event) {
    event.preventDefault();
    // console.log(event.currentTarget.elements);
    const optionsData = {};

    for (const inputElement of event.currentTarget.elements) {
        // console.log(inputElement);

        if (inputElement.hasAttribute('name') && inputElement.value !== '') {
            optionsData[inputElement.name] = inputElement.value;
        }
    }

    // console.log(optionsData);
    initPromise(optionsData);
}

function initPromise({ delay, step, amount } = {}) {
    // console.log(delay, step, amount);

    let firstDelay = Number(delay);
    const stepCall = Number(step);
    const allPosition = Number(amount);

    // console.log(firstDelay, stepCall, allPosition);

    for (let i = 0; i < allPosition; i += 1) {
        createPromise(i, firstDelay)
            .then(({ position, delay }) => {
                console.log(`✅ Fulfilled promise ${position + 1} in ${delay}ms`);
                Notify.success(`✅ Fulfilled promise ${position + 1} in ${delay}ms`);
            })
            .catch(({ position, delay }) => {
                console.log(`❌ Rejected promise ${position + 1} in ${delay}ms`);
                Notify.failure(`❌ Rejected promise ${position + 1} in ${delay}ms`);
            });
        firstDelay += stepCall;
    }
}

function createPromise(position, delay) {

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const shouldResolve = Math.random() > 0.3;

            if (shouldResolve) {
                resolve({ position, delay });
            } else {
                reject({ position, delay });
            }
        }, delay);
    });

    return promise;
}