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

    tabs('.tabheader__item', '.tabcontent',
        '.tabheader__items', 'tabheader__item_active');
    calc();
    cards();
    forms('form', modalTimerID);
    modal('[data-modal]', '.modal', modalTimerID);
    timer('.timer', '2023-06-31');
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        nextArrow: '.offer__slider-next',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});