import { Notify } from 'notiflix/build/notiflix-notify-aio';

const buttonStart = document.querySelector('[data-start]');
// console.log(buttonStart);

const buttonStop = document.querySelector('[data-stop]');
// console.log(buttonStop);

const bodyElement = document.querySelector('body');
// console.log(bodyElement);

let intervalChangeColorID = null;

function getRandomHexColor() {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    Notify.info(`Background-color: ${color}`);
    return color;
}

function viewBackgroundColor() {
    bodyElement.style.backgroundColor = getRandomHexColor();
}

function startChangeColor(event) {
    console.log('The change background-color is start');
    Notify.warning('The change background-color is start');

    bodyElement.style.backgroundColor = getRandomHexColor();

    event.target.setAttribute('disabled', '');
    event.target.removeEventListener('click', startChangeColor);
        
    buttonStop.removeAttribute('disabled');
    buttonStop.addEventListener('click', stopChangeColor);

    intervalChangeColorID = setInterval(viewBackgroundColor, 1000);
}

function stopChangeColor(event) {
    console.log('The change background-color is stopped');
    Notify.warning('The change background-color is stopped');

    event.target.setAttribute('disabled', '');
    event.target.removeEventListener('click', stopChangeColor);

    buttonStart.removeAttribute('disabled');
    buttonStart.addEventListener('click', startChangeColor);
    
    clearInterval(intervalChangeColorID);
    return;
}

buttonStart.addEventListener('click', startChangeColor);
buttonStop.setAttribute('disabled', '');