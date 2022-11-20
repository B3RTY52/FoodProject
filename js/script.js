"use strict";

window.addEventListener('DOMContentLoaded', () => {

    //  **TABS**
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            // item.style.display = 'none';  // inline-style
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        // tabsContent[i].style.display = 'block'; // inline-style
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    //    **TIMER**
    const deadline = '2022-12-31';

    function getTimeRemaining(endtime) {
        //получаем милисекунды от сейчас до окончания таймера:
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    //   **MODAL**

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');
    // modalCloseBtn = document.querySelector('[data-close]');

    // реализация через тогглер:
    // function togglerModal() {
    //     modal.classList.toggle('show');
    //     if (modal.classList.contains('show')) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = ''; //поставить настройки по дефолту
    //     }
    //     clearInterval(modalTimerID);
    // }
    // modalTrigger.forEach(btn => btn.addEventListener('click', togglerModal));
    // modalCloseBtn.addEventListener('click', togglerModal);
    // чтоб окно закрывалось при нажатии на Esc
    // document.addEventListener('keydown', (e) => {
    //     if (e.code === "Escape" && modal.classList.contains('show')) {
    //         togglerModal();
    //     }
    // });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerID);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; //поставить настройки по дефолту
    }

    modalTrigger.forEach(btn =>
        btn.addEventListener('click', openModal));

    modal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget ||
            e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    // чтоб окно закрывалось при нажатии на Esc
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    //чтоб запускалось через 50 секунд само
    const modalTimerID = setTimeout(openModal, 50000);

    // чтоб запускалось при полной прокрутке страницы само
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.
            clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);


    //   **MENU** 
    class MenuItem {
        constructor(src, alt, title,
            descr, price, parentSelector, ...classes) {
            this.title = title;
            this.src = src;
            this.alt = alt;
            this.descr = descr;
            this.priceUSD = price;
            this.classes = classes;
            this.transfer = 27;
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.priceUSD * this.transfer;
        }

        renderItem() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                element.classList.add('menu__item');
            } else {
                this.classes.forEach(className =>
                    element.classList.add(className));
            }

            element.innerHTML = `
                        <img src="${this.src}" alt="${this.alt}">
                        <h3 class="menu__item-subtitle">Меню “${this.title}”</h3>
                        <div class="menu__item-descr">${this.descr}</div>
                        <div class="menu__item-divider"></div>
                        <div class="menu__item-price">
                            <div class="menu__item-cost">Цена:</div>
                            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                        </div>
                `;
            this.parent.append(element);
        }
    }

    //работа с ошибками на примере в функции:
    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    // меняем на запрос с сервера:
    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         //деструктурируем элемент в методе forEach:
    //         data.forEach(({ img, altimg, title, descr, price }) => {
    //             new MenuItem(img, altimg, title, descr, price, '.menu__field .container')
    //                 .renderItem();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuItem(img, altimg, title, descr, price, '.menu__field .container')
                    .renderItem();
            });
        });

    // метод реактивной верстки:
    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));
    // function createCard(data) {
    //     data.forEach(({ img, altimg, title, descr, price }) => {
    //         const element = document.createElement('div');
    //         element.classList.add('menu__item');
    //         element.innerHTML = `
    //         <img src="${img}" alt="${altimg}">
    //         <h3 class="menu__item-subtitle">Меню “${title}”</h3>
    //         <div class="menu__item-descr">${descr}</div>
    //         <div class="menu__item-divider"></div>
    //         <div class="menu__item-price">
    //             <div class="menu__item-cost">Цена:</div>
    //             <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //         </div>
    //          `;
    //         document.querySelector('.menu .container').append(element);
    //     });
    // }
    ////////////////////////


    //  **FORMS**
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        succes: 'Спасибо! Мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    // async/await - парный оператор для работы с асинхронными ф-ями:
    const postData = async (url, data) => {
        const res = await fetch(url, { //await указывает коду, что надо ждать
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        // await ждет до 30 секунд по стандарту
        return await res.json(); //также сначала дожидается результата
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            padding-top: 10px;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            //ЗАМЕНИМ СТАРУЮ ТЕХНОЛОГИЮ:
            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            // request.setRequestHeader('Content-type', 'application/json');
            // const object = {};
            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });
            // const json = JSON.stringify(object);
            // request.send(json);
            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.succes);
            //         form.reset();
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // });
            // const object = {};
            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });
            ///////////////

            // метод, который формирует массив из массивов по парам объекта:
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            //НА БОЛЕЕ НОВУЮ С FETCH:
            // заменим отдельной функцией
            // fetch('server.php', {
            //     method: "POST",
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(object)
            // }) 

            // Еще Ha более новую:
            postData('http://localhost:3000/requests', json)
                .then(data => {  //data - это данные, которые придут с сервера
                    console.log(data);
                    showThanksModal(message.succes);
                    form.reset();
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset(); //очистка формы нужна в любом случае!
                });
        });
    }

    function showThanksModal(message) {
        const pervModalDialog = document.querySelector('.modal__dialog');

        pervModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');

        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            pervModalDialog.classList.add('show');
            pervModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));



    //   **SLIDER** 
    // сначала получаем элементы управления:
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prevBtn = document.querySelector('.offer__slider-prev'),
        nextBtn = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    // VER.1
    // поскольку количество слайдов у нас статично, то условие задаем отдельно:
    function indexCounter() {  //оформим в функцию
        if (slides.length < 10) {
            total.textContent = `0${slides.length}`;
            current.textContent = `0${slideIndex}`;
        } else {
            total.textContent = slides.length;
            current.textContent = slideIndex;
        }
    }

    indexCounter();

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    //ЭЛЕМЕНТЫ НАВИГАЦИИ ДЛЯ СЛАЙДЕРА:
    slider.style.position = 'relative';
    const indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    const dots = [];

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        indicators.append(dot);
        if (i == 0) {
            dot.style.opacity = 1;
        }
        dots.push(dot);
    }

    function dotsActivator(i) {
        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[i - 1].style.opacity = 1;
    }

    function strToDigits(str) {
        return +str.replace(/\D/g, '');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = strToDigits(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;
            indexCounter();
            dotsActivator(slideIndex);
        });
    });
    //ПЕРЕКЛЮЧЕНИЕ ЧЕРЕЗ СТРЕЛОЧКИ:
    nextBtn.addEventListener('click', () => {
        if (offset ==
            // +width.slice(0, width.length - 2) * (slides.length - 1);
            strToDigits(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += strToDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        indexCounter();
        dotsActivator(slideIndex);
    });

    prevBtn.addEventListener('click', () => {
        if (offset == 0) {
            offset = strToDigits(width) * (slides.length - 1);
        } else {
            offset -= strToDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        indexCounter();
        dotsActivator(slideIndex);
    });

    // // VER. 2 (easier):
    // //запускаем первый слайд, чтобы он отображался:
    // showSlides(slideIndex);

    // // поскольку количество слайдов у нас статично, то условие задаем отдельно:
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // // функция для отображения нужного слайда:
    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach(item => item.style.display = 'none');

    //     slides[slideIndex - 1].style.display = 'block';

    //     if (slideIndex < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // // функция для управления индексом слайда при переключении:
    // function plusSlides(n) {
    //     showSlides(slideIndex += n);
    // }

    // prevBtn.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // nextBtn.addEventListener('click', () => {
    //     plusSlides(1);
    // });


    //   **CALCULATOR**
    const result = document.querySelector('.calculating__result');
    let sex = 'female',
        height,
        weight,
        age,
        ratio = 1.375;

    function calcTotal() {

        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '_________ ккал';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) +
                (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) +
                (4.8 * height) - (5.7 * age)) * ratio);
        }

    }

    calcTotal();

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', e => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big',
        'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});