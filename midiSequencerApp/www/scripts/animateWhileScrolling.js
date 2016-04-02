$(window).scroll(function () {
    $('#nuovaCanzone').each(function () {
        var imagePos = $(this).offset().top;
        var imageHeight = $(this).height();
        var topOfWindow = $(window).scrollTop();

        if (imagePos < topOfWindow + imageHeight && imagePos + imageHeight > topOfWindow) {
            $(this).addClass("animated bounceInDown");
        } else {
            $(this).removeClass("animated bounceInDown");
        }
    });
});

$(window).scroll(function () {
    $('#archivioCanzoni').each(function () {
        var imagePos = $(this).offset().top;
        var imageHeight = $(this).height();
        var topOfWindow = $(window).scrollTop();

        if (imagePos < topOfWindow + imageHeight && imagePos + imageHeight > topOfWindow) {
            $(this).addClass("animated bounceInDown");
        } else {
            $(this).removeClass("animated bounceInDown");
        }
    });
});