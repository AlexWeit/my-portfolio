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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cclxuXHQkKCcuaGFtYnVyZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KGV2ZW50KTtcclxuXHJcblx0XHR2YXIgbmF2ID0gJCgnLm5hdmlnYXRpb24nKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyh0aGlzKTtcclxuXHJcblx0XHQvKlxyXG5cdFx0aWYobmF2Lmhhc0NsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpKSB7XHJcblx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYm9keS1hY3RpdmUnKTtcclxuXHRcdFx0bmF2LnJlbW92ZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnYm9keScpLmFkZENsYXNzKCdib2R5LWFjdGl2ZScpO1xyXG5cdFx0XHRuYXYuYWRkQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XHJcblx0XHR9Ki9cclxuXHJcblxyXG5cdFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCdib2R5LWFjdGl2ZScpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5tYWluLW1lbnUnKS50b2dnbGVDbGFzcygnbWFpbi1tZW51LWFjdGl2ZScpO1xyXG5cdFx0fSwgMzAwKTtcclxuXHRcdG5hdi50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcclxuXHR9KTtcclxufSk7Il19
