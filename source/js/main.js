// ---- MODULES INITIALIZATION ----- //

$(document).ready(function() {

	if ($('#hamburger').length) {
		MainMenu.init();
	}

	if ($('.arrow-down').length) {
		Test.init();
	}
});