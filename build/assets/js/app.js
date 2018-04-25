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

//------ Preloader Module -------//

var Preloader = (function() {
	
	var preloader = $('.preloader'),
		body = $('body'),
		percentsTotal = 0; //сколько картинок загружено

	//-Понадобятся-:
		//1.метод, который будет вычленять пути до картинок и формировать массив
		//2.метод, котрый считает и выставляет кол-во загруженных процентов
		//3.метод вставки картинки и в зависимости от этого высчитывания процентов

	//1.набор картинок
	var _imgPath = $('*').map(function(index, element) {
		var backgroundImg = $(element).css('background-image'),
			img = $(element).is('img'),
			path = ' '; //чем заполнять

		//если бэкграунд картинка существует
		if (backgroundImg != 'none') {
			path = backgroundImg.replace('url("', '').replace('")', ''); //делаем чистый путь до картинки
		}

		//если есть картинка
		if (img) {
			path = $(element).attr('src');
		}

		//если наполнение не пустое
		if (path) return path
	});

	//2.посчитать процент
	var _setPercents = function(totalPercent, currentPercent) {
		var percents = Math.ceil(currentPercent / totalPercent * 100); //чтобы округлялось в большую сторону и доходило до 100%
		
		$('.preloader__percents').text(percents + '%');

		//если 100 и более %, то прячем прелоадер
		if (percents >= 100) {
			preloader.delay(500);
			preloader.fadeOut('slow', function() {
				body.removeClass('body-preload');
			});
		}
	};

	//3.загрузить картинку и вставить процент
	var _loadImages = function(images) {

		//если картинок нет вообще, то прячем прелоадер
		if (!images.length) {
			preloader.delay(500);
			preloader.fadeOut('slow', function() {
				body.removeClass('body-preload');
			});
		}

		//если картинки есть, то используем стандартный метод для массивов
		images.forEach(function(image, index, imagesArray) {

			//создаем картинку заново (фейково)
			var fakeImage = $('<img>', {
				attr : {
					src : image
				}
			});

			//проверяем загрузилось ли изображение
			//error - если ошибка в пути картинки, то все равно загрузить
			fakeImage.on('load error', function() {
				percentsTotal++;
				_setPercents(imagesArray.length, percentsTotal);
			});
		});

	};

	return {
		init: function() {
			body.addClass('body-preload');

			//т.к. метод .map() возвращает объект, то преобразуем его в массив
			var imgsArray = _imgPath.toArray();

			_loadImages(imgsArray);
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

//-----SLIDER MODULE-----//

var Slider = (function() {

	var sliderContainer = $('.works__slider__container'),
		prevBtn = sliderContainer.find('.slider__nav__link_prev'),
		nextBtn = sliderContainer.find('.slider__nav__link_next'),
		prevSliderItems = prevBtn.find('.slider__nav__item'),
		nextSliderItems = nextBtn.find('.slider__nav__item'),
		itemsLength = prevSliderItems.length,
		display = sliderContainer.find('.slider__img'),
		bigImg = display.find('.slider__img_big'),
		title = sliderContainer.find('.slider__info__subtitle'),
		technology = sliderContainer.find('.slider__info__tech'),
		link = sliderContainer.find('.slider__info__btn'),
		duration = 500,
		isAnimate = false,
		counter = 0; 

	var _Defaults = function() {
		// left btn
		prevBtn
			.find('.slider__nav__item')
			.eq(counter - 1)
			.addClass('.slider__nav__item_active');

		// right btn
		nextBtn
			.find('.slider__nav__item')
			.eq(counter + 1)
			.addClass('.slider__nav__item_active');
	};

	var _prevSlideAnimate = function(sliderCounterPrev) {
		var reqItemPrev = prevSliderItems.eq(sliderCounterPrev - 1),
			activeItemPrev = prevSliderItems.filter('.slider__nav__item_active');

		activeItemPrev.animate({
			'top': '100%' //'100%' prev
		}, duration);

		reqItemPrev.animate({
			'top': 0
		}, duration, function() {
			activeItemPrev.removeClass('slider__nav__item_active')
				.css('top', '-100%'); // '-100%' prev
			
			$(this).addClass('slider__nav__item_active');

			isAnimate = false;
		});
	};

	var _nextSlideAnimate = function(sliderCounterNext) {
		var reqItemNextIndex = sliderCounterNext + 1,
			activeItemNext = nextSliderItems.filter('.slider__nav__item_active');

		if (reqItemNextIndex > itemsLength - 1) {
			reqItemNextIndex = 0;
		}

		var reqItemNext = nextSliderItems.eq(reqItemNextIndex);

		activeItemNext.animate({
			'top': '-100%' //'-100%' next
		}, duration);

		reqItemNext.animate({
			'top': 0
		}, duration, function() {
			activeItemNext.removeClass('slider__nav__item_active')
				.css('top', '100%'); // '100%' next
			
			$(this).addClass('slider__nav__item_active');

			isAnimate = false;
		});

	};

	var _getData = function() {
		var dataObj = {
			images : [],
			titles : [],
			technologys : [],
			links : []
		};

		prevSliderItems.each(function() {
			var $this = $(this); //each from 'prevSliderItems'

			dataObj.images.push($this.data('src'));
			dataObj.titles.push($this.data('title'));
			dataObj.technologys.push($this.data('tech'));
			dataObj.links.push($this.data('link'));
		});

		return dataObj;
	};

	var _changeData = function(changeDataCounter) {
		var _data = _getData();

		bigImg
			.stop(true, true)
			.fadeOut(duration, function() {
				$(this).attr('src', _data.images[changeDataCounter]);
			})
			.fadeIn(duration);

		title
			.stop(true, true)
			.fadeOut(duration, function() {
				$(this).text(_data.titles[changeDataCounter])
			})
			.stop(true, true)
			.fadeIn(duration);

		technology
			.stop(true, true)
			.fadeOut(duration, function() {
				$(this).text(_data.technologys[changeDataCounter])
			})
			.stop(true, true)
			.fadeIn(duration);

		link.attr('href', _data.links[changeDataCounter]);
	};

	var _moveSlide = function(direction) {
		var directions = {
			next : function() {
				if (counter < itemsLength - 1) {
					counter++;
				} else {
					counter = 0;
				}
			},
			prev : function() {
				if (counter > 0) {
					counter--;
				} else {
					counter = itemsLength - 1;
				}
			}
		};

		directions[direction]();


		if(!isAnimate) {

			isAnimate = true;

			_nextSlideAnimate(counter);
			_prevSlideAnimate(counter);
			_changeData(counter);
		}
	};

	return {
		init: function() {
			_Defaults();

			$('.slider__nav__link_prev').on('click', function(e) {
				e.preventDefault();

				_moveSlide('prev');
			});

			$('.slider__nav__link_next').on('click', function(e) {
				e.preventDefault();

				_moveSlide('next');
			})
		}
	}
})();
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
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwibWFpbi1tZW51LmpzIiwic2xpZGVyLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8tLS0tLS0tIFRlc3QgTW9kdWxlIC0tLS0tLS0tLy9cclxuXHJcbnZhciBUZXN0ID0gKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBfZnJvbVRlc3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFsZXJ0KFwiSGkgdGhlcmUhIEknbSBpbnNpZGUgVGVzdCBNb2R1bGVcIik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJy5hcnJvdy1kb3duJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoZSk7XHJcblx0XHRcdFx0X2Zyb21UZXN0KCk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG59KSgpO1xyXG4iLCIvLy0tLS0tLSBQcmVsb2FkZXIgTW9kdWxlIC0tLS0tLS0vL1xyXG5cclxudmFyIFByZWxvYWRlciA9IChmdW5jdGlvbigpIHtcclxuXHRcclxuXHR2YXIgcHJlbG9hZGVyID0gJCgnLnByZWxvYWRlcicpLFxyXG5cdFx0Ym9keSA9ICQoJ2JvZHknKSxcclxuXHRcdHBlcmNlbnRzVG90YWwgPSAwOyAvL9GB0LrQvtC70YzQutC+INC60LDRgNGC0LjQvdC+0Log0LfQsNCz0YDRg9C20LXQvdC+XHJcblxyXG5cdC8vLdCf0L7QvdCw0LTQvtCx0Y/RgtGB0Y8tOlxyXG5cdFx0Ly8xLtC80LXRgtC+0LQsINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LLRi9GH0LvQtdC90Y/RgtGMINC/0YPRgtC4INC00L4g0LrQsNGA0YLQuNC90L7QuiDQuCDRhNC+0YDQvNC40YDQvtCy0LDRgtGMINC80LDRgdGB0LjQslxyXG5cdFx0Ly8yLtC80LXRgtC+0LQsINC60L7RgtGA0YvQuSDRgdGH0LjRgtCw0LXRgiDQuCDQstGL0YHRgtCw0LLQu9GP0LXRgiDQutC+0Lst0LLQviDQt9Cw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQvtGG0LXQvdGC0L7QslxyXG5cdFx0Ly8zLtC80LXRgtC+0LQg0LLRgdGC0LDQstC60Lgg0LrQsNGA0YLQuNC90LrQuCDQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0Y3RgtC+0LPQviDQstGL0YHRh9C40YLRi9Cy0LDQvdC40Y8g0L/RgNC+0YbQtdC90YLQvtCyXHJcblxyXG5cdC8vMS7QvdCw0LHQvtGAINC60LDRgNGC0LjQvdC+0LpcclxuXHR2YXIgX2ltZ1BhdGggPSAkKCcqJykubWFwKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcblx0XHR2YXIgYmFja2dyb3VuZEltZyA9ICQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXHJcblx0XHRcdGltZyA9ICQoZWxlbWVudCkuaXMoJ2ltZycpLFxyXG5cdFx0XHRwYXRoID0gJyAnOyAvL9GH0LXQvCDQt9Cw0L/QvtC70L3Rj9GC0YxcclxuXHJcblx0XHQvL9C10YHQu9C4INCx0Y3QutCz0YDQsNGD0L3QtCDQutCw0YDRgtC40L3QutCwINGB0YPRidC10YHRgtCy0YPQtdGCXHJcblx0XHRpZiAoYmFja2dyb3VuZEltZyAhPSAnbm9uZScpIHtcclxuXHRcdFx0cGF0aCA9IGJhY2tncm91bmRJbWcucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTsgLy/QtNC10LvQsNC10Lwg0YfQuNGB0YLRi9C5INC/0YPRgtGMINC00L4g0LrQsNGA0YLQuNC90LrQuFxyXG5cdFx0fVxyXG5cclxuXHRcdC8v0LXRgdC70Lgg0LXRgdGC0Ywg0LrQsNGA0YLQuNC90LrQsFxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHRwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL9C10YHQu9C4INC90LDQv9C+0LvQvdC10L3QuNC1INC90LUg0L/Rg9GB0YLQvtC1XHJcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGhcclxuXHR9KTtcclxuXHJcblx0Ly8yLtC/0L7RgdGH0LjRgtCw0YLRjCDQv9GA0L7RhtC10L3RglxyXG5cdHZhciBfc2V0UGVyY2VudHMgPSBmdW5jdGlvbih0b3RhbFBlcmNlbnQsIGN1cnJlbnRQZXJjZW50KSB7XHJcblx0XHR2YXIgcGVyY2VudHMgPSBNYXRoLmNlaWwoY3VycmVudFBlcmNlbnQgLyB0b3RhbFBlcmNlbnQgKiAxMDApOyAvL9GH0YLQvtCx0Ysg0L7QutGA0YPQs9C70Y/Qu9C+0YHRjCDQsiDQsdC+0LvRjNGI0YPRjiDRgdGC0L7RgNC+0L3RgyDQuCDQtNC+0YXQvtC00LjQu9C+INC00L4gMTAwJVxyXG5cdFx0XHJcblx0XHQkKCcucHJlbG9hZGVyX19wZXJjZW50cycpLnRleHQocGVyY2VudHMgKyAnJScpO1xyXG5cclxuXHRcdC8v0LXRgdC70LggMTAwINC4INCx0L7Qu9C10LUgJSwg0YLQviDQv9GA0Y/Rh9C10Lwg0L/RgNC10LvQvtCw0LTQtdGAXHJcblx0XHRpZiAocGVyY2VudHMgPj0gMTAwKSB7XHJcblx0XHRcdHByZWxvYWRlci5kZWxheSg1MDApO1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgnc2xvdycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ2JvZHktcHJlbG9hZCcpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLzMu0LfQsNCz0YDRg9C30LjRgtGMINC60LDRgNGC0LjQvdC60YMg0Lgg0LLRgdGC0LDQstC40YLRjCDQv9GA0L7RhtC10L3RglxyXG5cdHZhciBfbG9hZEltYWdlcyA9IGZ1bmN0aW9uKGltYWdlcykge1xyXG5cclxuXHRcdC8v0LXRgdC70Lgg0LrQsNGA0YLQuNC90L7QuiDQvdC10YIg0LLQvtC+0LHRidC1LCDRgtC+INC/0YDRj9GH0LXQvCDQv9GA0LXQu9C+0LDQtNC10YBcclxuXHRcdGlmICghaW1hZ2VzLmxlbmd0aCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZGVsYXkoNTAwKTtcclxuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoJ3Nsb3cnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRib2R5LnJlbW92ZUNsYXNzKCdib2R5LXByZWxvYWQnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly/QtdGB0LvQuCDQutCw0YDRgtC40L3QutC4INC10YHRgtGMLCDRgtC+INC40YHQv9C+0LvRjNC30YPQtdC8INGB0YLQsNC90LTQsNGA0YLQvdGL0Lkg0LzQtdGC0L7QtCDQtNC70Y8g0LzQsNGB0YHQuNCy0L7QslxyXG5cdFx0aW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1hZ2UsIGluZGV4LCBpbWFnZXNBcnJheSkge1xyXG5cclxuXHRcdFx0Ly/RgdC+0LfQtNCw0LXQvCDQutCw0YDRgtC40L3QutGDINC30LDQvdC+0LLQviAo0YTQtdC50LrQvtCy0L4pXHJcblx0XHRcdHZhciBmYWtlSW1hZ2UgPSAkKCc8aW1nPicsIHtcclxuXHRcdFx0XHRhdHRyIDoge1xyXG5cdFx0XHRcdFx0c3JjIDogaW1hZ2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly/Qv9GA0L7QstC10YDRj9C10Lwg0LfQsNCz0YDRg9C30LjQu9C+0YHRjCDQu9C4INC40LfQvtCx0YDQsNC20LXQvdC40LVcclxuXHRcdFx0Ly9lcnJvciAtINC10YHQu9C4INC+0YjQuNCx0LrQsCDQsiDQv9GD0YLQuCDQutCw0YDRgtC40L3QutC4LCDRgtC+INCy0YHQtSDRgNCw0LLQvdC+INC30LDQs9GA0YPQt9C40YLRjFxyXG5cdFx0XHRmYWtlSW1hZ2Uub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdFx0X3NldFBlcmNlbnRzKGltYWdlc0FycmF5Lmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnYm9keS1wcmVsb2FkJyk7XHJcblxyXG5cdFx0XHQvL9GCLtC6LiDQvNC10YLQvtC0IC5tYXAoKSDQstC+0LfQstGA0LDRidCw0LXRgiDQvtCx0YrQtdC60YIsINGC0L4g0L/RgNC10L7QsdGA0LDQt9GD0LXQvCDQtdCz0L4g0LIg0LzQsNGB0YHQuNCyXHJcblx0XHRcdHZhciBpbWdzQXJyYXkgPSBfaW1nUGF0aC50b0FycmF5KCk7XHJcblxyXG5cdFx0XHRfbG9hZEltYWdlcyhpbWdzQXJyYXkpO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoKTtcclxuIiwiLy8tLS0gTWFpbiBNZW51IE1vZHVsZSAtLS0tLS0tLS0tLS0tLy9cclxuXHJcbnZhciBNYWluTWVudSA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgX2NsaWNrSGFtYnVyZ2VyID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbmF2ID0gJCgnLm5hdmlnYXRpb24nKTtcclxuXHJcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ2JvZHktYWN0aXZlJyk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLm1haW4tbWVudScpLnRvZ2dsZUNsYXNzKCdtYWluLW1lbnUtYWN0aXZlJyk7XHJcblx0XHR9LCAzMDApO1xyXG5cdFx0bmF2LnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cclxuXHRcdCQoJy5oYW1idXJnZXInKS50b2dnbGVDbGFzcygnb24nKTtcclxuXHRcdCQoJy5oYW1idXJnZXItbWVudScpLnRvZ2dsZUNsYXNzKCdhbmltYXRlJyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJy5oYW1idXJnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRfY2xpY2tIYW1idXJnZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59KSgpO1xyXG4iLCIvLy0tLS0tU0xJREVSIE1PRFVMRS0tLS0tLy9cclxuXHJcbnZhciBTbGlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBzbGlkZXJDb250YWluZXIgPSAkKCcud29ya3NfX3NsaWRlcl9fY29udGFpbmVyJyksXHJcblx0XHRwcmV2QnRuID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX25hdl9fbGlua19wcmV2JyksXHJcblx0XHRuZXh0QnRuID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX25hdl9fbGlua19uZXh0JyksXHJcblx0XHRwcmV2U2xpZGVySXRlbXMgPSBwcmV2QnRuLmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpLFxyXG5cdFx0bmV4dFNsaWRlckl0ZW1zID0gbmV4dEJ0bi5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKSxcclxuXHRcdGl0ZW1zTGVuZ3RoID0gcHJldlNsaWRlckl0ZW1zLmxlbmd0aCxcclxuXHRcdGRpc3BsYXkgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW1nJyksXHJcblx0XHRiaWdJbWcgPSBkaXNwbGF5LmZpbmQoJy5zbGlkZXJfX2ltZ19iaWcnKSxcclxuXHRcdHRpdGxlID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2luZm9fX3N1YnRpdGxlJyksXHJcblx0XHR0ZWNobm9sb2d5ID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2luZm9fX3RlY2gnKSxcclxuXHRcdGxpbmsgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW5mb19fYnRuJyksXHJcblx0XHRkdXJhdGlvbiA9IDUwMCxcclxuXHRcdGlzQW5pbWF0ZSA9IGZhbHNlLFxyXG5cdFx0Y291bnRlciA9IDA7IFxyXG5cclxuXHR2YXIgX0RlZmF1bHRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBsZWZ0IGJ0blxyXG5cdFx0cHJldkJ0blxyXG5cdFx0XHQuZmluZCgnLnNsaWRlcl9fbmF2X19pdGVtJylcclxuXHRcdFx0LmVxKGNvdW50ZXIgLSAxKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcclxuXHJcblx0XHQvLyByaWdodCBidG5cclxuXHRcdG5leHRCdG5cclxuXHRcdFx0LmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpXHJcblx0XHRcdC5lcShjb3VudGVyICsgMSlcclxuXHRcdFx0LmFkZENsYXNzKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9wcmV2U2xpZGVBbmltYXRlID0gZnVuY3Rpb24oc2xpZGVyQ291bnRlclByZXYpIHtcclxuXHRcdHZhciByZXFJdGVtUHJldiA9IHByZXZTbGlkZXJJdGVtcy5lcShzbGlkZXJDb3VudGVyUHJldiAtIDEpLFxyXG5cdFx0XHRhY3RpdmVJdGVtUHJldiA9IHByZXZTbGlkZXJJdGVtcy5maWx0ZXIoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcclxuXHJcblx0XHRhY3RpdmVJdGVtUHJldi5hbmltYXRlKHtcclxuXHRcdFx0J3RvcCc6ICcxMDAlJyAvLycxMDAlJyBwcmV2XHJcblx0XHR9LCBkdXJhdGlvbik7XHJcblxyXG5cdFx0cmVxSXRlbVByZXYuYW5pbWF0ZSh7XHJcblx0XHRcdCd0b3AnOiAwXHJcblx0XHR9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGFjdGl2ZUl0ZW1QcmV2LnJlbW92ZUNsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKVxyXG5cdFx0XHRcdC5jc3MoJ3RvcCcsICctMTAwJScpOyAvLyAnLTEwMCUnIHByZXZcclxuXHRcdFx0XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0aXNBbmltYXRlID0gZmFsc2U7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX25leHRTbGlkZUFuaW1hdGUgPSBmdW5jdGlvbihzbGlkZXJDb3VudGVyTmV4dCkge1xyXG5cdFx0dmFyIHJlcUl0ZW1OZXh0SW5kZXggPSBzbGlkZXJDb3VudGVyTmV4dCArIDEsXHJcblx0XHRcdGFjdGl2ZUl0ZW1OZXh0ID0gbmV4dFNsaWRlckl0ZW1zLmZpbHRlcignLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xyXG5cclxuXHRcdGlmIChyZXFJdGVtTmV4dEluZGV4ID4gaXRlbXNMZW5ndGggLSAxKSB7XHJcblx0XHRcdHJlcUl0ZW1OZXh0SW5kZXggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZXFJdGVtTmV4dCA9IG5leHRTbGlkZXJJdGVtcy5lcShyZXFJdGVtTmV4dEluZGV4KTtcclxuXHJcblx0XHRhY3RpdmVJdGVtTmV4dC5hbmltYXRlKHtcclxuXHRcdFx0J3RvcCc6ICctMTAwJScgLy8nLTEwMCUnIG5leHRcclxuXHRcdH0sIGR1cmF0aW9uKTtcclxuXHJcblx0XHRyZXFJdGVtTmV4dC5hbmltYXRlKHtcclxuXHRcdFx0J3RvcCc6IDBcclxuXHRcdH0sIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0YWN0aXZlSXRlbU5leHQucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpXHJcblx0XHRcdFx0LmNzcygndG9wJywgJzEwMCUnKTsgLy8gJzEwMCUnIG5leHRcclxuXHRcdFx0XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0aXNBbmltYXRlID0gZmFsc2U7XHJcblx0XHR9KTtcclxuXHJcblx0fTtcclxuXHJcblx0dmFyIF9nZXREYXRhID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGF0YU9iaiA9IHtcclxuXHRcdFx0aW1hZ2VzIDogW10sXHJcblx0XHRcdHRpdGxlcyA6IFtdLFxyXG5cdFx0XHR0ZWNobm9sb2d5cyA6IFtdLFxyXG5cdFx0XHRsaW5rcyA6IFtdXHJcblx0XHR9O1xyXG5cclxuXHRcdHByZXZTbGlkZXJJdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpOyAvL2VhY2ggZnJvbSAncHJldlNsaWRlckl0ZW1zJ1xyXG5cclxuXHRcdFx0ZGF0YU9iai5pbWFnZXMucHVzaCgkdGhpcy5kYXRhKCdzcmMnKSk7XHJcblx0XHRcdGRhdGFPYmoudGl0bGVzLnB1c2goJHRoaXMuZGF0YSgndGl0bGUnKSk7XHJcblx0XHRcdGRhdGFPYmoudGVjaG5vbG9neXMucHVzaCgkdGhpcy5kYXRhKCd0ZWNoJykpO1xyXG5cdFx0XHRkYXRhT2JqLmxpbmtzLnB1c2goJHRoaXMuZGF0YSgnbGluaycpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBkYXRhT2JqO1xyXG5cdH07XHJcblxyXG5cdHZhciBfY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGNoYW5nZURhdGFDb3VudGVyKSB7XHJcblx0XHR2YXIgX2RhdGEgPSBfZ2V0RGF0YSgpO1xyXG5cclxuXHRcdGJpZ0ltZ1xyXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxyXG5cdFx0XHQuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5hdHRyKCdzcmMnLCBfZGF0YS5pbWFnZXNbY2hhbmdlRGF0YUNvdW50ZXJdKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmZhZGVJbihkdXJhdGlvbik7XHJcblxyXG5cdFx0dGl0bGVcclxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcclxuXHRcdFx0LmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQodGhpcykudGV4dChfZGF0YS50aXRsZXNbY2hhbmdlRGF0YUNvdW50ZXJdKVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxyXG5cdFx0XHQuZmFkZUluKGR1cmF0aW9uKTtcclxuXHJcblx0XHR0ZWNobm9sb2d5XHJcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXHJcblx0XHRcdC5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLnRleHQoX2RhdGEudGVjaG5vbG9neXNbY2hhbmdlRGF0YUNvdW50ZXJdKVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxyXG5cdFx0XHQuZmFkZUluKGR1cmF0aW9uKTtcclxuXHJcblx0XHRsaW5rLmF0dHIoJ2hyZWYnLCBfZGF0YS5saW5rc1tjaGFuZ2VEYXRhQ291bnRlcl0pO1xyXG5cdH07XHJcblxyXG5cdHZhciBfbW92ZVNsaWRlID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XHJcblx0XHR2YXIgZGlyZWN0aW9ucyA9IHtcclxuXHRcdFx0bmV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmIChjb3VudGVyIDwgaXRlbXNMZW5ndGggLSAxKSB7XHJcblx0XHRcdFx0XHRjb3VudGVyKys7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0cHJldiA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmIChjb3VudGVyID4gMCkge1xyXG5cdFx0XHRcdFx0Y291bnRlci0tO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb3VudGVyID0gaXRlbXNMZW5ndGggLSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRkaXJlY3Rpb25zW2RpcmVjdGlvbl0oKTtcclxuXHJcblxyXG5cdFx0aWYoIWlzQW5pbWF0ZSkge1xyXG5cclxuXHRcdFx0aXNBbmltYXRlID0gdHJ1ZTtcclxuXHJcblx0XHRcdF9uZXh0U2xpZGVBbmltYXRlKGNvdW50ZXIpO1xyXG5cdFx0XHRfcHJldlNsaWRlQW5pbWF0ZShjb3VudGVyKTtcclxuXHRcdFx0X2NoYW5nZURhdGEoY291bnRlcik7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRfRGVmYXVsdHMoKTtcclxuXHJcblx0XHRcdCQoJy5zbGlkZXJfX25hdl9fbGlua19wcmV2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0X21vdmVTbGlkZSgncHJldicpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoJy5zbGlkZXJfX25hdl9fbGlua19uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0X21vdmVTbGlkZSgnbmV4dCcpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxufSkoKTsiLCIvLyAtLS0tIE1PRFVMRVMgSU5JVElBTElaQVRJT04gLS0tLS0gLy9cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cdFByZWxvYWRlci5pbml0KCk7XHJcblxyXG5cdGlmICgkKCcjaGFtYnVyZ2VyJykubGVuZ3RoKSB7XHJcblx0XHRNYWluTWVudS5pbml0KCk7XHJcblx0fVxyXG5cclxuXHRpZiAoJCgnLmFycm93LWRvd24nKS5sZW5ndGgpIHtcclxuXHRcdFRlc3QuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0aWYgKCQoJyN3b3Jrc19fc2xpZGVyJykubGVuZ3RoKSB7XHJcblx0XHRTbGlkZXIuaW5pdCgpO1xyXG5cdH1cclxufSk7Il19
