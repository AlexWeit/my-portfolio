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

// ---- MODULES INITIALIZATION ----- //

$(document).ready(function() {
	Preloader.init();

	if ($('#hamburger').length) {
		MainMenu.init();
	}

	if ($('.arrow-down').length) {
		Test.init();
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwibWFpbi1tZW51LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLS0tLS0tLSBUZXN0IE1vZHVsZSAtLS0tLS0tLS8vXHJcblxyXG52YXIgVGVzdCA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgX2Zyb21UZXN0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhbGVydChcIkhpIHRoZXJlISBJJ20gaW5zaWRlIFRlc3QgTW9kdWxlXCIpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuYXJyb3ctZG93bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KGUpO1xyXG5cdFx0XHRcdF9mcm9tVGVzdCgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxufSkoKTtcclxuIiwiLy8tLS0tLS0gUHJlbG9hZGVyIE1vZHVsZSAtLS0tLS0tLy9cclxuXHJcbnZhciBQcmVsb2FkZXIgPSAoZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0dmFyIHByZWxvYWRlciA9ICQoJy5wcmVsb2FkZXInKSxcclxuXHRcdGJvZHkgPSAkKCdib2R5JyksXHJcblx0XHRwZXJjZW50c1RvdGFsID0gMDsgLy/RgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxyXG5cclxuXHQvLy3Qn9C+0L3QsNC00L7QsdGP0YLRgdGPLTpcclxuXHRcdC8vMS7QvNC10YLQvtC0LCDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdGCINCy0YvRh9C70LXQvdGP0YLRjCDQv9GD0YLQuCDQtNC+INC60LDRgNGC0LjQvdC+0Log0Lgg0YTQvtGA0LzQuNGA0L7QstCw0YLRjCDQvNCw0YHRgdC40LJcclxuXHRcdC8vMi7QvNC10YLQvtC0LCDQutC+0YLRgNGL0Lkg0YHRh9C40YLQsNC10YIg0Lgg0LLRi9GB0YLQsNCy0LvRj9C10YIg0LrQvtC7LdCy0L4g0LfQsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0L7RhtC10L3RgtC+0LJcclxuXHRcdC8vMy7QvNC10YLQvtC0INCy0YHRgtCw0LLQutC4INC60LDRgNGC0LjQvdC60Lgg0Lgg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGN0YLQvtCz0L4g0LLRi9GB0YfQuNGC0YvQstCw0L3QuNGPINC/0YDQvtGG0LXQvdGC0L7QslxyXG5cclxuXHQvLzEu0L3QsNCx0L7RgCDQutCw0YDRgtC40L3QvtC6XHJcblx0dmFyIF9pbWdQYXRoID0gJCgnKicpLm1hcChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG5cdFx0dmFyIGJhY2tncm91bmRJbWcgPSAkKGVsZW1lbnQpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxyXG5cdFx0XHRpbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKSxcclxuXHRcdFx0cGF0aCA9ICcgJzsgLy/Rh9C10Lwg0LfQsNC/0L7Qu9C90Y/RgtGMXHJcblxyXG5cdFx0Ly/QtdGB0LvQuCDQsdGN0LrQs9GA0LDRg9C90LQg0LrQsNGA0YLQuNC90LrQsCDRgdGD0YnQtdGB0YLQstGD0LXRglxyXG5cdFx0aWYgKGJhY2tncm91bmRJbWcgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHBhdGggPSBiYWNrZ3JvdW5kSW1nLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7IC8v0LTQtdC70LDQtdC8INGH0LjRgdGC0YvQuSDQv9GD0YLRjCDQtNC+INC60LDRgNGC0LjQvdC60LhcclxuXHRcdH1cclxuXHJcblx0XHQvL9C10YHQu9C4INC10YHRgtGMINC60LDRgNGC0LjQvdC60LBcclxuXHRcdGlmIChpbWcpIHtcclxuXHRcdFx0cGF0aCA9ICQoZWxlbWVudCkuYXR0cignc3JjJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly/QtdGB0LvQuCDQvdCw0L/QvtC70L3QtdC90LjQtSDQvdC1INC/0YPRgdGC0L7QtVxyXG5cdFx0aWYgKHBhdGgpIHJldHVybiBwYXRoXHJcblx0fSk7XHJcblxyXG5cdC8vMi7Qv9C+0YHRh9C40YLQsNGC0Ywg0L/RgNC+0YbQtdC90YJcclxuXHR2YXIgX3NldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWxQZXJjZW50LCBjdXJyZW50UGVyY2VudCkge1xyXG5cdFx0dmFyIHBlcmNlbnRzID0gTWF0aC5jZWlsKGN1cnJlbnRQZXJjZW50IC8gdG90YWxQZXJjZW50ICogMTAwKTsgLy/Rh9GC0L7QsdGLINC+0LrRgNGD0LPQu9GP0LvQvtGB0Ywg0LIg0LHQvtC70YzRiNGD0Y4g0YHRgtC+0YDQvtC90YMg0Lgg0LTQvtGF0L7QtNC40LvQviDQtNC+IDEwMCVcclxuXHRcdFxyXG5cdFx0JCgnLnByZWxvYWRlcl9fcGVyY2VudHMnKS50ZXh0KHBlcmNlbnRzICsgJyUnKTtcclxuXHJcblx0XHQvL9C10YHQu9C4IDEwMCDQuCDQsdC+0LvQtdC1ICUsINGC0L4g0L/RgNGP0YfQtdC8INC/0YDQtdC70L7QsNC00LXRgFxyXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZGVsYXkoNTAwKTtcclxuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoJ3Nsb3cnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRib2R5LnJlbW92ZUNsYXNzKCdib2R5LXByZWxvYWQnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8zLtC30LDQs9GA0YPQt9C40YLRjCDQutCw0YDRgtC40L3QutGDINC4INCy0YHRgtCw0LLQuNGC0Ywg0L/RgNC+0YbQtdC90YJcclxuXHR2YXIgX2xvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcclxuXHJcblx0XHQvL9C10YHQu9C4INC60LDRgNGC0LjQvdC+0Log0L3QtdGCINCy0L7QvtCx0YnQtSwg0YLQviDQv9GA0Y/Rh9C10Lwg0L/RgNC10LvQvtCw0LTQtdGAXHJcblx0XHRpZiAoIWltYWdlcy5sZW5ndGgpIHtcclxuXHRcdFx0cHJlbG9hZGVyLmRlbGF5KDUwMCk7XHJcblx0XHRcdHByZWxvYWRlci5mYWRlT3V0KCdzbG93JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnYm9keS1wcmVsb2FkJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8v0LXRgdC70Lgg0LrQsNGA0YLQuNC90LrQuCDQtdGB0YLRjCwg0YLQviDQuNGB0L/QvtC70YzQt9GD0LXQvCDRgdGC0LDQvdC00LDRgNGC0L3Ri9C5INC80LXRgtC+0LQg0LTQu9GPINC80LDRgdGB0LjQstC+0LJcclxuXHRcdGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltYWdlLCBpbmRleCwgaW1hZ2VzQXJyYXkpIHtcclxuXHJcblx0XHRcdC8v0YHQvtC30LTQsNC10Lwg0LrQsNGA0YLQuNC90LrRgyDQt9Cw0L3QvtCy0L4gKNGE0LXQudC60L7QstC+KVxyXG5cdFx0XHR2YXIgZmFrZUltYWdlID0gJCgnPGltZz4nLCB7XHJcblx0XHRcdFx0YXR0ciA6IHtcclxuXHRcdFx0XHRcdHNyYyA6IGltYWdlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8v0L/RgNC+0LLQtdGA0Y/QtdC8INC30LDQs9GA0YPQt9C40LvQvtGB0Ywg0LvQuCDQuNC30L7QsdGA0LDQttC10L3QuNC1XHJcblx0XHRcdC8vZXJyb3IgLSDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LIg0L/Rg9GC0Lgg0LrQsNGA0YLQuNC90LrQuCwg0YLQviDQstGB0LUg0YDQsNCy0L3QviDQt9Cw0LPRgNGD0LfQuNGC0YxcclxuXHRcdFx0ZmFrZUltYWdlLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cGVyY2VudHNUb3RhbCsrO1xyXG5cdFx0XHRcdF9zZXRQZXJjZW50cyhpbWFnZXNBcnJheS5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGJvZHkuYWRkQ2xhc3MoJ2JvZHktcHJlbG9hZCcpO1xyXG5cclxuXHRcdFx0Ly/Rgi7Qui4g0LzQtdGC0L7QtCAubWFwKCkg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QsdGK0LXQutGCLCDRgtC+INC/0YDQtdC+0LHRgNCw0LfRg9C10Lwg0LXQs9C+INCyINC80LDRgdGB0LjQslxyXG5cdFx0XHR2YXIgaW1nc0FycmF5ID0gX2ltZ1BhdGgudG9BcnJheSgpO1xyXG5cclxuXHRcdFx0X2xvYWRJbWFnZXMoaW1nc0FycmF5KTtcclxuXHRcdH1cclxuXHR9XHJcbn0pKCk7XHJcbiIsIi8vLS0tIE1haW4gTWVudSBNb2R1bGUgLS0tLS0tLS0tLS0tLS8vXHJcblxyXG52YXIgTWFpbk1lbnUgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIF9jbGlja0hhbWJ1cmdlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG5hdiA9ICQoJy5uYXZpZ2F0aW9uJyk7XHJcblxyXG5cdFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCdib2R5LWFjdGl2ZScpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5tYWluLW1lbnUnKS50b2dnbGVDbGFzcygnbWFpbi1tZW51LWFjdGl2ZScpO1xyXG5cdFx0fSwgMzAwKTtcclxuXHRcdG5hdi50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcclxuXHJcblx0XHQkKCcuaGFtYnVyZ2VyJykudG9nZ2xlQ2xhc3MoJ29uJyk7XHJcblx0XHQkKCcuaGFtYnVyZ2VyLW1lbnUnKS50b2dnbGVDbGFzcygnYW5pbWF0ZScpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuaGFtYnVyZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0X2NsaWNrSGFtYnVyZ2VyKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoKTtcclxuIiwiLy8gLS0tLSBNT0RVTEVTIElOSVRJQUxJWkFUSU9OIC0tLS0tIC8vXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHRQcmVsb2FkZXIuaW5pdCgpO1xyXG5cclxuXHRpZiAoJCgnI2hhbWJ1cmdlcicpLmxlbmd0aCkge1xyXG5cdFx0TWFpbk1lbnUuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0aWYgKCQoJy5hcnJvdy1kb3duJykubGVuZ3RoKSB7XHJcblx0XHRUZXN0LmluaXQoKTtcclxuXHR9XHJcbn0pOyJdfQ==
