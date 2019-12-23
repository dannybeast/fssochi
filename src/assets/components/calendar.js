import moment from 'moment';
import $ from "jquery";
import {
    slicer
} from './slicer';
import 'dayjs';
import {
    Request
} from './xhr';


// test /js/data/poster.json
Request('GET', `posters.json`).then(response => {
    postersCalendar(JSON.parse(response));
})

// при выборе тегов будет новый запрос
function postersCalendar(resources) {
    var resources = resources;
    const calendar = document.getElementById('calendar');
    const calendarButtons = document.querySelectorAll('.calendar-trigger');
    const calendarDays = document.querySelector('.calendar-days');

    // все дни недели
    var defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
        return moment(i, 'e').locale('ru').startOf('week').isoWeekday(i + 1).format('ddd');
    });

    // все месяца
    var defaultMonths = Array.apply(null, Array(12)).map(function (_, i) {
        return moment().locale('ru').month(i).format('MMMM');
    });

    // Добавляю дни недели в шапку таблицы
    defaultWeekdays.forEach(function (day) {
        calendarDays.insertAdjacentHTML('beforeend', `<div class="calendar-day">${day}</div>`);
    });


    // Filters
    let month_select = document.querySelector('.js-month-select');
    let year_select = document.querySelector('.js-year-select');
    let tag_radio_buttons = document.querySelectorAll('[name="poster-type"]');


    // Filter tags
    tag_radio_buttons.forEach(function (button) {
        button.addEventListener('change', function () {
            Request('GET', `http://point.icbcode.ru/events/all?filter=${this.value}&object=${object_id}`).then(response => {
                resources = JSON.parse(response);
                renderCalendar();
                eventDots(resources);
            })
        });
    })
    //-
    // Filter months
    month_select.addEventListener('change', function () {
        let year = year_select.value;
        let date = moment('' + year + '-' + this.value + '-01').format('YYYY-MM-DD');
        calendar.dataset.reference = date;
        createDates(date);
        eventDots(resources);
    });

    // Filter years
    year_select.addEventListener('change', function () {
        let month = month_select.value;
        let date = moment('' + this.value + '-' + month + '-01').format('YYYY-MM-DD');
        calendar.dataset.reference = date;
        createDates(date);
        eventDots(resources);
    });
    //-

    // Render the calendar
    function renderCalendar() {
        const today = moment().format('YYYY-MM-DD');

        calendar.dataset.reference = today;
        createDates(today);
    }
    renderCalendar();

    // Trigger a re-render of dates based on a calendar button click
    calendarButtons.forEach(function (trigger) {
        trigger.addEventListener('click', function () {

            let reference = calendar.dataset.reference;
            if (trigger.classList.contains('calendar-prev')) {

                // Update the date based on the previous month
                getNewDate(reference, 'prev');
            } else {
                // Update the date based on the next month
                getNewDate(reference, 'next');
            }
        });
    });

    // Returns a future/past month based on the trigger clicked
    function getNewDate(date, type) {
        if (type === 'prev') {
            date = moment(date).subtract(1, 'month').format('MMMM-DD-YYYY');
        } else {
            date = moment(date).add(1, 'month').format('MMMM-DD-YYYY');
        }

        // Update the reference date (for proper date mapping)
        calendar.dataset.reference = date;

        // Render the calendar dates based on the updated date
        createDates(date);
    }

    // Creates the dates for the calendar
    function createDates(date) {

        const calendarDates = document.querySelector('.calendar-dates');

        //Remove child nodes from dates parent
        while (calendarDates.firstChild) {
            calendarDates.removeChild(calendarDates.firstChild);
        }

        // Create reference variables for date specific objects
        const today = moment().format('MM-D-YYYY'),
            year = moment(date).format('YYYY'),
            month = moment(date).format('MM'),
            day = moment(date).format('DD'),
            days = moment(date).daysInMonth(),
            lastDays = moment(date).subtract(1, 'month').daysInMonth(),
            offset = getOffset(date);


        // filter

        // Добавляю месяца в фильтр
        if (!month_select.options.length) {
            defaultMonths.forEach(function (month, i) {
                month_select.insertAdjacentHTML('beforeend', `<option value="${i+1}">${month}</option>`);
            });
        }

        // текущий год в селект +-2
        let years_array = [year];

        for (let i = 1; i <= 2; i++) {
            years_array.push(parseInt(year) + i);
            years_array.push(parseInt(year) - i);
        }
        years_array.sort((a, b) => a - b);
        if (!year_select.options.length) {
            years_array.forEach(function (year) {
                year_select.insertAdjacentHTML('beforeend', `<option>${year}</option>`);
            });
        }
        //-

        month_select.value = moment(month).format('M');
        year_select.value = year;
        //-

        //Render previous month's days
        for (let i = 0; i < offset; i++) {
            calendarDates.innerHTML += createDate('prev', lastDays - offset + i + 1, month, year);
        }

        //Render current month's days
        for (let i = 0; i < days; i++) {
            calendarDates.innerHTML += createDate('now', i + 1, month, year);
        }

        //Render next month's days
        let remainder = getRemainder(7, offset + days);
        for (let i = 0; i < remainder; i++) {
            calendarDates.innerHTML += createDate('next', i + 1, month, year);
        }

        //Highlight today if applicable (matching month and year)
        if (moment().format('MM') === month && moment().format('YYYY') === year) {
            let td_today = document.querySelector(`.calendar-date[data-date="${today}"]`);
            if (td_today)
                td_today.classList.add('today-date');
        }

        // Дни смещения
        function getOffset(today) {
            let day = moment(today).startOf('month').format('dddd');

            if (day === 'Monday') {
                return 0;
            }
            if (day === 'Tuesday') {
                return 1;
            }
            if (day === 'Wednesday') {
                return 2;
            }
            if (day === 'Thursday') {
                return 3;
            }
            if (day === 'Friday') {
                return 4;
            }
            if (day === 'Saturday') {
                return 5;
            }
            if (day === 'Sunday') {
                return 6;
            }
        }

        function getMonth(month) {
            switch (month) {
                case 1:
                    return "января"
                case 2:
                    return "февраля"
                case 3:
                    return "марта"
                case 4:
                    return "апреля"
                case 5:
                    return "мая"
                case 6:
                    return "июня"
                case 7:
                    return "июля"
                case 8:
                    return "августа"
                case 9:
                    return "сентября"
                case 10:
                    return "октября"
                case 11:
                    return "ноября"
                case 12:
                    return "декабря"
                    break;
            }
        }

        // Returns the remainder of days / 7
        function getRemainder(x, y) {
            if (Number.isInteger(y / x)) {
                return 0;
            }
            return 7 - (y % x);
        }

        //Creates and appends the calendar-date html elements
        function createDate(type, number, month, year) {
            let date = month + '-' + number + '-' + year;
            let monthNumber = parseInt(month);
            let monthName = getMonth(monthNumber);


            if (type === 'prev') {
                date = moment(date).subtract(1, 'month').format('YYYY-MM-DD');
                let prevMonth = monthNumber - 1;
                if (prevMonth === 0) {
                    prevMonth = 12
                }
                monthName = getMonth(prevMonth);
            }

            if (type === 'next') {
                date = moment(date).add(1, 'month').format('YYYY-MM-DD');
                let nextMonth = monthNumber + 1;
                if (nextMonth === 13) {
                    nextMonth = 1
                }
                monthName = getMonth(nextMonth);
            }

            return `<button
		class="calendar-date ${type}-date"
		data-day="${number}"
		data-date="${date}">
		    <span class="calendar-number"><span>${number}</span></span>
		    <span class="calendar-events"></span>
		</button>`;
        }
    }


    //Event Dots
    // document.addEventListener('DOMContentLoaded', function () {
    //   eventDots(resources);
    // });

    eventDots(resources);

    calendarButtons.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            eventDots(resources);
        });
    });

    function eventDots(resources) {

        var calendarDates = document.querySelectorAll('.calendar-dates > *');

        resources.forEach(function (event) {
            event.dates.all_dates.forEach(function (date) {
                makeDot(date, event.pagetitle, event.introtext, event.url);
            });

        });

        function makeDot(date, title, introtext, url) {
            date = moment(date).format('MM-DD-YYYY');
            var element = document.querySelector(`.calendar-date[data-date="${date}"]`);

            if (element) {
                element.classList.add('has-events');
                element.childNodes[3].innerHTML += `
                <span class="calendar-event">
                    <span class="calendar-event__date">${moment(date).format('DD.MM.YYYY')}</span>
                    <span class="calendar-event__title">${title}</span>
                    <span class="calendar-event__text">${introtext}</span>
                    <a href="${url}" class="calendar-event__btn">Подробнее</a>
                </span>`;

                $('.calendar-event__title').each(function () {
                    $(this).html(slicer($(this).text(), 25));
                });

                let events_count = element.childNodes[3].childNodes.length;
                //let more_btn = element.querySelector('.more-events');


                // Если больше 1 события на дату
                // if (events_count > 1) {
                //     more_btn.parentNode.removeChild(more_btn);
                // }

                // element.childNodes[3].childNodes[0].innerHTML += `<a data-modal-id="more-events" class="js-custom-modal more-events"><span>Все события</span> <strong>${events_count}</strong></a>`;

                // if (events_count > 1) {
                //     element.querySelector('.more-events').classList.add('show');
                // }

            }

        }
        moreEvents();
    }

    function moreEvents() {
        // more link
        document.querySelectorAll('.more-events').forEach(function (more_btn) {
            more_btn.addEventListener('click', function () {
                let eventsNode = this.closest('.calendar-events').cloneNode(true);
                let date = this.closest('.calendar-date').getAttribute('data-date');
                //openModal(eventsNode, date);
            });
        });
    }


    // more
    $('body').delegate('.has-events', 'mouseover',
        function () {
            $(this).find('.calendar-events').addClass('open')
        });
    $('body').delegate('.has-events', 'mouseout', function () {
        $(this).find('.calendar-events').removeClass('open')
    });

    // function openModal(eventsNode, date) {
    //     let window = document.getElementById('more-events');
    //     let window_content = window.querySelector('.modal-block__content');
    //     let window_title_date = window.querySelector('.modal-block__title .date');

    //     window_content.innerHTML = "";
    //     window_title_date.innerHTML = moment(date).locale('ru').format('dddd, DD MMMM YYYY');
    //     window_content.appendChild(eventsNode);
    //     eventsNode.querySelector('.more-events').remove();
    // }

} []