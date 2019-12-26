// SCSS
import "./assets/scss/main.scss";
import $ from "jquery";
import "slick-slider";
import './assets/components/calendar';
import IMask from 'imask'

$(document).ready(function () {
  $(".calendar-slider").slick({
    slidesToShow: 2
  });

  var phoneMask = IMask(
    document.querySelector('.js-phone-mask'), {
      mask: '+{7}(000)000-00-00',
      lazy: false
    });


  var dateMask = IMask(
    document.querySelector('.js-date-mask'), {
      mask: Date,
      min: new Date(1990, 0, 1),
      max: new Date(2020, 0, 1),
      lazy: false
    });
});