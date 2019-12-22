// SCSS
import "./assets/scss/main.scss";
import $ from "jquery";
import "slick-slider";

$(document).ready(function() {
  $(".calendar-slider").slick({
    slidesToShow: 2
  });
});
