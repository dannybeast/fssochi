$(document).ready(function () {
    $('.fancybox').fancybox();

    $('.fancybox-media').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        helpers: {
            media: true
        },
        youtube: {
            start: 0
        }
    });

    $('.b-map').each(function (index, el) {
        var address = $(this).attr('data-address');

        var parts = $(this).attr('data-coords').split(',');

        var point = [parseFloat(parts[0]), parseFloat(parts[1])];


        function init() {
            var myMap = new ymaps.Map(el, {
                center: point,
                zoom: 16
            });
            myMap.controls.add(
                new ymaps.control.ZoomControl()
            );
            myPlacemark = new ymaps.Placemark(point, {
                balloonContentHeader: address
            });
            myMap.geoObjects.add(myPlacemark);
        }
        ymaps.ready(init);
    });

    $('.menu li a, .main-menu li a').on("click", function () {
        if ($(this).parent().find('.menu').length == 0) return true;

        $(this).parent().parent().find('li.active').each(function () {
            if ($(this).children('ul.menu').length > 0) {
                $(this).children('ul.menu').slideUp(200, function () { $(this).parent().removeClass('active'); });
            }
        });

        if (!$(this).parent().hasClass('active')) {
            $(this).parent().children('.menu').slideDown(200, function () { $(this).parent().addClass('active'); });
        }
        return false;
    });

    if ($("a.youtube-video").length >= 0) {
        $("a.youtube-video").each(function () {
            var $y_link = $(this).attr("href");
            var $get = 2;
            var $def = '';
            var $y_prew = youTube($y_link, $get, $def);
            $(this).find("img.youtube-prew").attr({ src: $y_prew });
        });
    }

});