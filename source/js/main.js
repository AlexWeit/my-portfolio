// ---- MODULES INITIALIZATION ----- //

$(document).ready(function() {
	Preloader.init();

	if ($('#hamburger').length) {
		MainMenu.init();
	}

	if ($('.arrow-down').length) {
		Test.init();
	}

	if ($('#works__slider').length) {
		Slider.init();
	}

	if($('.works__form').length) {
		ContactForm.init();
	}

	if ($('#blog').length) {
		BlogMenu.init();
	}
});