//------- Test Module --------//

var Test = (function() {
	var _fromTest = function() {
		alert("Hi there! I'm inside Test Module");
	}

	return {
		init: function() {
			$('.arrow-down').on('click', function(e) {
				e.preventDefault(e);
				_fromTest();
			})
		}
	}
	
})();

//--- Main Menu Module -------------//

var MainMenu = (function() {
	var _clickHamburger = function() {
		var nav = $('.navigation');

		$('body').toggleClass('body-active');
		setTimeout(function () {
			$('.main-menu').toggleClass('main-menu-active');
		}, 300);
		nav.toggleClass('navigation-active');

		$('.hamburger').toggleClass('on');
		$('.hamburger-menu').toggleClass('animate');
	}

	return {
		init: function() {
			$('.hamburger').on('click', function(e) {
				e.preventDefault();

				_clickHamburger();
			});
		}
	}
})();

// ---- MODULES INITIALIZATION ----- //

$(document).ready(function() {

	if ($('#hamburger').length) {
		MainMenu.init();
	}

	if ($('.arrow-down').length) {
		Test.init();
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwibWFpbi1tZW51LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy0tLS0tLS0gVGVzdCBNb2R1bGUgLS0tLS0tLS0vL1xyXG5cclxudmFyIFRlc3QgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIF9mcm9tVGVzdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YWxlcnQoXCJIaSB0aGVyZSEgSSdtIGluc2lkZSBUZXN0IE1vZHVsZVwiKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnLmFycm93LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdChlKTtcclxuXHRcdFx0XHRfZnJvbVRlc3QoKTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbn0pKCk7XHJcbiIsIi8vLS0tIE1haW4gTWVudSBNb2R1bGUgLS0tLS0tLS0tLS0tLS8vXHJcblxyXG52YXIgTWFpbk1lbnUgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIF9jbGlja0hhbWJ1cmdlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG5hdiA9ICQoJy5uYXZpZ2F0aW9uJyk7XHJcblxyXG5cdFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCdib2R5LWFjdGl2ZScpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5tYWluLW1lbnUnKS50b2dnbGVDbGFzcygnbWFpbi1tZW51LWFjdGl2ZScpO1xyXG5cdFx0fSwgMzAwKTtcclxuXHRcdG5hdi50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcclxuXHJcblx0XHQkKCcuaGFtYnVyZ2VyJykudG9nZ2xlQ2xhc3MoJ29uJyk7XHJcblx0XHQkKCcuaGFtYnVyZ2VyLW1lbnUnKS50b2dnbGVDbGFzcygnYW5pbWF0ZScpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuaGFtYnVyZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0X2NsaWNrSGFtYnVyZ2VyKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoKTtcclxuIiwiLy8gLS0tLSBNT0RVTEVTIElOSVRJQUxJWkFUSU9OIC0tLS0tIC8vXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHJcblx0aWYgKCQoJyNoYW1idXJnZXInKS5sZW5ndGgpIHtcclxuXHRcdE1haW5NZW51LmluaXQoKTtcclxuXHR9XHJcblxyXG5cdGlmICgkKCcuYXJyb3ctZG93bicpLmxlbmd0aCkge1xyXG5cdFx0VGVzdC5pbml0KCk7XHJcblx0fVxyXG59KTsiXX0=
