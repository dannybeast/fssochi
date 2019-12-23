// SCSS
import "./assets/scss/main.scss";
import $ from "jquery";
import "slick-slider";
import './assets/components/calendar';

$(document).ready(function () {
  $(".calendar-slider").slick({
    slidesToShow: 2
  });
});