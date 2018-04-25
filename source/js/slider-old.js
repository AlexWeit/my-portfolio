//-----SLIDER MODULE-----//

var Slider = (function() {

	// ****** SLIDER ***** ///
	var counter = 1, // счетчик, который показывает какой слайд сейчас отображен
		//по умолчанию будет всегда показываться 1й слайд (поэтому = 1)
		duration = 300, // время, за которое будет происходить анимация
		inProcess = false; //для регулировки очереди анимаций

	var _moveSlide = function(slideContainer, direction) {
		var items = slideContainer.find('.slider__nav__item'), // или $('.slider__nav__item', slideContainer)
			activeItem = items.filter('.slider__nav__item_active'),
			direction = direction == 'down' ? 100 : -100; //направление

		//обнулить счетчик, когда он равен количеству слайдов, чтобы вернуть первый слайд
		if (counter >= items.length) {
			counter = 0;
		}

		/*
		if (direction = 100) {
			counter = counter;
		} else if (direction = -100) {
			counter = counter + 2;
		}
		*/

		var reqItem = items.eq(counter); // слайд, который нужно пролистать

		//активный слайд уедет вниз, на его место спустится сверху следующий
		activeItem.animate({
			'top': direction + '%' //'100%'
		}, duration);

		reqItem.animate({
			'top': 0
		}, duration, function() {
			activeItem.removeClass('slider__nav__item_active')
				.css('top', '-' + direction + '%'); // '-100%'
			$(this).addClass('slider__nav__item_active');

			inProcess = false;
		});

		console.log(slideContainer);
		console.log(direction);
		console.log(counter);

	}

	// ****** SLIDESHOW ***** ///

	var _slideShow = function() {
		var	sliderContainer = $('.works__slider__container'),
			smallImages = sliderContainer.find('.slider__img_small'),
			smallImagesSrc = smallImages.eq(counter - 1).attr('src'),
			bigImage = sliderContainer.find('.slider__img_big'),
			fadedOut = $.Deferred(),
			loaded = $.Deferred();


		console.log(smallImages);
		console.log(smallImagesSrc);

		//спрятать картинку
		
		bigImage
			.stop(true, true)
			.fadeOut(duration, function() {
				bigImage
					.attr('src', smallImagesSrc)
					.fadeIn(duration)
			});
	}

	return {
		init: function() {
			$('.slider__nav__link_next').on('click', function(e) {
				e.preventDefault();

				if (!inProcess) {
					inProcess = true;

					_moveSlide($('.slider__nav__link_prev'), 'up');
					_moveSlide($('.slider__nav__link_next'), 'down');

					counter++;

					_slideShow();
				}
			});

			$('.slider__nav__link_prev').on('click', function(e) {
				e.preventDefault();

				if (!inProcess) {
					inProcess = true;

					_moveSlide($('.slider__nav__link_prev'), 'up');
					_moveSlide($('.slider__nav__link_next'), 'down');

					counter++;

					_slideShow();
				}
			})
		}
	}
})();