import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputDate = document.querySelector('#datetime-picker');
// console.dir(inputDate);

const buttonTimerStart = document.querySelector('[data-start]');
// console.dir(buttonTimerStart);

const buttonTimerStop = document.querySelector('[data-stop]');
// console.dir(buttonTimerStop);

const buttonTimerReset = document.querySelector('[data-reset]');
// console.dir(buttonTimerReset);

const dataFieldDays = document.querySelector('[data-days]');
const dataFieldHours = document.querySelector('[data-hours]');
const dataFieldMinutes = document.querySelector('[data-minutes]');
const dataFieldSeconds = document.querySelector('[data-seconds]');

// console.dir(dataFieldDays);
// console.dir(dataFieldHours);
// console.dir(dataFieldMinutes);
// console.dir(dataFieldSeconds);

let intervalTimerID = null;
let choosenDate = null;
let timerDate = null;
let stopTime = null;
let differentTime = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        console.log(selectedDates[0]);

        choosenDate = Date.parse(selectedDates[0]);
        
        console.log('Current date:', Date.now());
        Notify.info(`Choosen date: ${selectedDates[0]}`);

        console.log('Choosen date:', choosenDate, `- ${inputDate.value}`);
        Notify.info(`Choosen date: ${inputDate.value}`);

        if (choosenDate <= Date.now()) {
            console.log('Please choose a date in the future');
            Notify.failure('Please choose a date in the future');
            // alert('Please choose a date in the future');
            
            if (!buttonTimerStart.hasAttribute('disabled')) {
                buttonTimerStart.setAttribute('disabled', '');
                buttonTimerStart.removeEventListener('click', startTimer);
            }
        } else {
            buttonTimerStart.removeAttribute('disabled');

            console.log('The start button is active');
            Notify.success('The start button is active');

            buttonTimerStart.addEventListener('click', startTimer);
        }
    },
};

flatpickr(inputDate, options);
// const dltDate = flatpickr(inputDate, options);
// console.log(dltDate);

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

function startTimer(event) {
    console.log('The timer is start');
    Notify.warning('The timer is start');

    inputDate.setAttribute('disabled', '');

    event.target.setAttribute('disabled', '');
    event.target.removeEventListener('click', startTimer);

    buttonTimerStop.removeAttribute('disabled');
    buttonTimerStop.addEventListener('click', stopTimer);

    buttonTimerReset.removeAttribute('disabled');
    buttonTimerReset.addEventListener('click', resetTimer);

    if (stopTime === null) {
        timerDate = choosenDate - Date.now();
    } else {
        timerDate = stopTime;
        choosenDate = stopTime + Date.now();
    }

    console.log('Set time for timer: ', convertMs(timerDate));

    const { days, hours, minutes, seconds } = convertMs(timerDate);
    Notify.info('Set time for timer:');

    dataFieldDays.textContent = addLeadingZero(days);
    dataFieldHours.textContent = addLeadingZero(hours);
    dataFieldMinutes.textContent = addLeadingZero(minutes);
    dataFieldSeconds.textContent = addLeadingZero(seconds);

    intervalTimerID = setInterval(viewTimerTime, 1000);
}

function stopTimer(event) {
    console.log('The timer is stopped');
    Notify.warning('The timer is stopped');

    event.target.setAttribute('disabled', '');
    event.target.removeEventListener('click', stopTimer);

    buttonTimerStart.removeAttribute('disabled');
    buttonTimerStart.addEventListener('click', startTimer);

    stopTime = choosenDate - Date.now();
    console.log('Stop time for timer: ', convertMs(stopTime));

    clearInterval(intervalTimerID);
}

function resetTimer(event) {
    console.log('The timer is reset');
    Notify.warning('The timer is reset');

    inputDate.removeAttribute('disabled');
    console.log(`The last choosed data for timer: ${inputDate.value}`);
    Notify.info(`The last choosed data for timer: ${inputDate.value}`);

    event.target.setAttribute('disabled', '');
    event.target.removeEventListener('click', resetTimer);

    buttonTimerStart.setAttribute('disabled', '');
    buttonTimerStart.removeEventListener('click', startTimer);

    buttonTimerStop.setAttribute('disabled', '');
    buttonTimerStop.removeEventListener('click', stopTimer);

    clearInterval(intervalTimerID);

    dataFieldDays.textContent = addLeadingZero(0);
    dataFieldHours.textContent = addLeadingZero(0);
    dataFieldMinutes.textContent = addLeadingZero(0);
    dataFieldSeconds.textContent = addLeadingZero(0);

    intervalTimerID = null;
    choosenDate = null;
    timerDate = null;
    stopTime = null;
    differentTime = null;

    return;
}

function viewTimerTime() {
    if (stopTime === null) {
        differentTime = choosenDate - Date.now();
    } else {
        differentTime = choosenDate - Date.now() - Number(1000);
        stopTime = null;
    }

    differentTime = choosenDate - Date.now();

    if (differentTime <= 0) {
        clearInterval(intervalTimerID);
        inputDate.removeAttribute('disabled');
        console.log('The timer is stopped');
        Notify.warning('The timer is stopped');

        buttonTimerStop.setAttribute('disabled', '');
        buttonTimerStop.removeEventListener('click', stopTimer);

        buttonTimerReset.setAttribute('disabled', '');
        buttonTimerReset.removeEventListener('click', resetTimer);
        
        intervalTimerID = null;
        choosenDate = null;
        timerDate = null;
        stopTime = null;
        differentTime = null;

        return;
    } else {
        const { days, hours, minutes, seconds } = convertMs(differentTime);
    
        dataFieldDays.textContent = addLeadingZero(days);
        dataFieldHours.textContent = addLeadingZero(hours);
        dataFieldMinutes.textContent = addLeadingZero(minutes);
        dataFieldSeconds.textContent = addLeadingZero(seconds);
    }
}

function addLeadingZero(value) {
    return String(value).padStart(2, 0);
}