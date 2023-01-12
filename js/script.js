import tabs from './modules/tabs';
import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import timer from './modules/timer';
import { openModal } from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {
    const modalTimerID = setTimeout(() =>
        openModal('.modal', modalTimerID), 50000);

    tabs();
    calc();
    cards();
    forms('form', modalTimerID);
    modal('[data-modal]', '.modal', modalTimerID);
    slider();
    timer();
});