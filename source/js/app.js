$(document).ready(function() {

	$('.hamburger').on('click', function(event) {
		event.preventDefault(event);

		var nav = $('.navigation');

		console.log(this);

		/*
		if(nav.hasClass('navigation-active')) {
			$('body').removeClass('body-active');
			nav.removeClass('navigation-active');
		} else {
			$('body').addClass('body-active');
			nav.addClass('navigation-active');
		}*/


		$('body').toggleClass('body-active');
		setTimeout(function () {
			$('.main-menu').toggleClass('main-menu-active');
		}, 300);
		nav.toggleClass('navigation-active');
	});
});