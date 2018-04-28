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
			});
		}
	}
})();
//----- Blog-Menu Module ------//

var BlogMenu = (function() {
	
	var sidebar = $('.sidebar__container'),
		sidebarTablet = $('.sidebar__container_tablet'),
		articles = $('.article'),
		body = document.body,
		articlePositionsArray = []; //пустой массив для координат статей


	var _FixedMenu = function(elementTop) {

		sidebar.addClass('fixed');
		sidebarTablet.addClass('fixed');
		
		var	scrollTop = $(window).scrollTop(),
			menuTopPosition = Math.max(15, elementTop - scrollTop); //вернет наибольшее

		sidebar.css('top', menuTopPosition);
		sidebarTablet.css('top', menuTopPosition);
	};

	var _FillArticlePositionsArray = function() { // наполняем пустой массив объектами со свойствами (позициями статей)

		for (var i = 0; i < articles.length; i++) {
			articlePositionsArray[i] = {}; // каждый элемент массива делаем объектом
            articlePositionsArray[i].top = articles.eq(i).offset().top - 100; // свойство объекта
            articlePositionsArray[i].bottom = articlePositionsArray[i].top + articles.eq(i).innerHeight(); // свойство объекта
		}		
	};

	var _PageScroll = function() {

		var pageScrollTop = $(window).scrollTop();

		for (var i = 0; i < articlePositionsArray.length; i++) {
			if (pageScrollTop >= articlePositionsArray[i].top && pageScrollTop <= articlePositionsArray[i].bottom) {
				var reqLink = $('.sidebar__item').eq(i).find('.sidebar__link'),
					otherLinks = reqLink.closest('.sidebar__item').siblings().find('.sidebar__link'),
					reqLinkTablet = $('.blog__sidebar_tablet').find('.sidebar__item').eq(i).find('.sidebar__link'),
					otherLinksTablet = reqLinkTablet.closest('.sidebar__item').siblings().find('.sidebar__link');

				reqLink.addClass('sidebar__link_active');
				reqLinkTablet.addClass('sidebar__link_active');
				otherLinks.removeClass('sidebar__link_active');
				otherLinksTablet.removeClass('sidebar__link_active');
			}
		}
	};

	var _ItemClick = function(e) {
		e.preventDefault();

		var reqSidebarLink = $(this),
			reqSidebarItem = reqSidebarLink.closest('.sidebar__item'),
			reqItemIndex = reqSidebarItem.index(), // индекс текущего линк-элемента
			otherSidebarItems = reqSidebarItem.siblings(),
			otherSidebarLinks = otherSidebarItems.find('.sidebar__link'),
			articles = $('.article'),
			reqArticle = articles.eq(reqItemIndex),
			reqArticleOffsetTop = reqArticle.offset().top,
			otherArticles = reqArticle.siblings();

		$(window).off('scroll', _PageScroll);

		$('body, html').animate({
			'scrollTop': reqArticleOffsetTop
		}, function() {
			reqSidebarLink.addClass('sidebar__link_active');
			reqArticle.addClass('article_active');
			otherSidebarLinks.removeClass('sidebar__link_active');
			otherArticles.removeClass('article_active');

			$(window).scroll(function() {
				_PageScroll();
			});
		});
	};
	
	return {
		init: function() {

			var sidebarOffsetTop = sidebar.offset().top; // топ-координата относительно начала страницы
			var sidebarTabletOffsetTop = sidebarTablet.offset().top;

			$(window).scroll(function() {
				_FixedMenu(sidebarOffsetTop);
				_FixedMenu(sidebarTabletOffsetTop);			
			});

			$(window).scroll(function() {
				_PageScroll();				
			});

			$(window).on('load', function() {
				_FillArticlePositionsArray();
			});

			$('.sidebar__link').on('click', _ItemClick);

			$('.sidebar__disk_tablet').on('click', function(e) {
				e.preventDefault();
				$(this).parents('.blog__sidebar_tablet').toggleClass('blog__sidebar_tablet_closed');
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

	if ($('#works__slider').length) {
		Slider.init();
	}

	if ($('#blog').length) {
		BlogMenu.init();
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwibWFpbi1tZW51LmpzIiwic2xpZGVyLmpzIiwiYmxvZy1tZW51LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8tLS0tLS0tIFRlc3QgTW9kdWxlIC0tLS0tLS0tLy9cclxuXHJcbnZhciBUZXN0ID0gKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBfZnJvbVRlc3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFsZXJ0KFwiSGkgdGhlcmUhIEknbSBpbnNpZGUgVGVzdCBNb2R1bGVcIik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJy5hcnJvdy1kb3duJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoZSk7XHJcblx0XHRcdFx0X2Zyb21UZXN0KCk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG59KSgpO1xyXG4iLCIvLy0tLS0tLSBQcmVsb2FkZXIgTW9kdWxlIC0tLS0tLS0vL1xyXG5cclxudmFyIFByZWxvYWRlciA9IChmdW5jdGlvbigpIHtcclxuXHRcclxuXHR2YXIgcHJlbG9hZGVyID0gJCgnLnByZWxvYWRlcicpLFxyXG5cdFx0Ym9keSA9ICQoJ2JvZHknKSxcclxuXHRcdHBlcmNlbnRzVG90YWwgPSAwOyAvL9GB0LrQvtC70YzQutC+INC60LDRgNGC0LjQvdC+0Log0LfQsNCz0YDRg9C20LXQvdC+XHJcblxyXG5cdC8vLdCf0L7QvdCw0LTQvtCx0Y/RgtGB0Y8tOlxyXG5cdFx0Ly8xLtC80LXRgtC+0LQsINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LLRi9GH0LvQtdC90Y/RgtGMINC/0YPRgtC4INC00L4g0LrQsNGA0YLQuNC90L7QuiDQuCDRhNC+0YDQvNC40YDQvtCy0LDRgtGMINC80LDRgdGB0LjQslxyXG5cdFx0Ly8yLtC80LXRgtC+0LQsINC60L7RgtGA0YvQuSDRgdGH0LjRgtCw0LXRgiDQuCDQstGL0YHRgtCw0LLQu9GP0LXRgiDQutC+0Lst0LLQviDQt9Cw0LPRgNGD0LbQtdC90L3Ri9GFINC/0YDQvtGG0LXQvdGC0L7QslxyXG5cdFx0Ly8zLtC80LXRgtC+0LQg0LLRgdGC0LDQstC60Lgg0LrQsNGA0YLQuNC90LrQuCDQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0Y3RgtC+0LPQviDQstGL0YHRh9C40YLRi9Cy0LDQvdC40Y8g0L/RgNC+0YbQtdC90YLQvtCyXHJcblxyXG5cdC8vMS7QvdCw0LHQvtGAINC60LDRgNGC0LjQvdC+0LpcclxuXHR2YXIgX2ltZ1BhdGggPSAkKCcqJykubWFwKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcblx0XHR2YXIgYmFja2dyb3VuZEltZyA9ICQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXHJcblx0XHRcdGltZyA9ICQoZWxlbWVudCkuaXMoJ2ltZycpLFxyXG5cdFx0XHRwYXRoID0gJyAnOyAvL9GH0LXQvCDQt9Cw0L/QvtC70L3Rj9GC0YxcclxuXHJcblx0XHQvL9C10YHQu9C4INCx0Y3QutCz0YDQsNGD0L3QtCDQutCw0YDRgtC40L3QutCwINGB0YPRidC10YHRgtCy0YPQtdGCXHJcblx0XHRpZiAoYmFja2dyb3VuZEltZyAhPSAnbm9uZScpIHtcclxuXHRcdFx0cGF0aCA9IGJhY2tncm91bmRJbWcucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTsgLy/QtNC10LvQsNC10Lwg0YfQuNGB0YLRi9C5INC/0YPRgtGMINC00L4g0LrQsNGA0YLQuNC90LrQuFxyXG5cdFx0fVxyXG5cclxuXHRcdC8v0LXRgdC70Lgg0LXRgdGC0Ywg0LrQsNGA0YLQuNC90LrQsFxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHRwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvL9C10YHQu9C4INC90LDQv9C+0LvQvdC10L3QuNC1INC90LUg0L/Rg9GB0YLQvtC1XHJcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGhcclxuXHR9KTtcclxuXHJcblx0Ly8yLtC/0L7RgdGH0LjRgtCw0YLRjCDQv9GA0L7RhtC10L3RglxyXG5cdHZhciBfc2V0UGVyY2VudHMgPSBmdW5jdGlvbih0b3RhbFBlcmNlbnQsIGN1cnJlbnRQZXJjZW50KSB7XHJcblx0XHR2YXIgcGVyY2VudHMgPSBNYXRoLmNlaWwoY3VycmVudFBlcmNlbnQgLyB0b3RhbFBlcmNlbnQgKiAxMDApOyAvL9GH0YLQvtCx0Ysg0L7QutGA0YPQs9C70Y/Qu9C+0YHRjCDQsiDQsdC+0LvRjNGI0YPRjiDRgdGC0L7RgNC+0L3RgyDQuCDQtNC+0YXQvtC00LjQu9C+INC00L4gMTAwJVxyXG5cdFx0XHJcblx0XHQkKCcucHJlbG9hZGVyX19wZXJjZW50cycpLnRleHQocGVyY2VudHMgKyAnJScpO1xyXG5cclxuXHRcdC8v0LXRgdC70LggMTAwINC4INCx0L7Qu9C10LUgJSwg0YLQviDQv9GA0Y/Rh9C10Lwg0L/RgNC10LvQvtCw0LTQtdGAXHJcblx0XHRpZiAocGVyY2VudHMgPj0gMTAwKSB7XHJcblx0XHRcdHByZWxvYWRlci5kZWxheSg1MDApO1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgnc2xvdycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ2JvZHktcHJlbG9hZCcpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLzMu0LfQsNCz0YDRg9C30LjRgtGMINC60LDRgNGC0LjQvdC60YMg0Lgg0LLRgdGC0LDQstC40YLRjCDQv9GA0L7RhtC10L3RglxyXG5cdHZhciBfbG9hZEltYWdlcyA9IGZ1bmN0aW9uKGltYWdlcykge1xyXG5cclxuXHRcdC8v0LXRgdC70Lgg0LrQsNGA0YLQuNC90L7QuiDQvdC10YIg0LLQvtC+0LHRidC1LCDRgtC+INC/0YDRj9GH0LXQvCDQv9GA0LXQu9C+0LDQtNC10YBcclxuXHRcdGlmICghaW1hZ2VzLmxlbmd0aCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZGVsYXkoNTAwKTtcclxuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoJ3Nsb3cnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRib2R5LnJlbW92ZUNsYXNzKCdib2R5LXByZWxvYWQnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly/QtdGB0LvQuCDQutCw0YDRgtC40L3QutC4INC10YHRgtGMLCDRgtC+INC40YHQv9C+0LvRjNC30YPQtdC8INGB0YLQsNC90LTQsNGA0YLQvdGL0Lkg0LzQtdGC0L7QtCDQtNC70Y8g0LzQsNGB0YHQuNCy0L7QslxyXG5cdFx0aW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1hZ2UsIGluZGV4LCBpbWFnZXNBcnJheSkge1xyXG5cclxuXHRcdFx0Ly/RgdC+0LfQtNCw0LXQvCDQutCw0YDRgtC40L3QutGDINC30LDQvdC+0LLQviAo0YTQtdC50LrQvtCy0L4pXHJcblx0XHRcdHZhciBmYWtlSW1hZ2UgPSAkKCc8aW1nPicsIHtcclxuXHRcdFx0XHRhdHRyIDoge1xyXG5cdFx0XHRcdFx0c3JjIDogaW1hZ2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly/Qv9GA0L7QstC10YDRj9C10Lwg0LfQsNCz0YDRg9C30LjQu9C+0YHRjCDQu9C4INC40LfQvtCx0YDQsNC20LXQvdC40LVcclxuXHRcdFx0Ly9lcnJvciAtINC10YHQu9C4INC+0YjQuNCx0LrQsCDQsiDQv9GD0YLQuCDQutCw0YDRgtC40L3QutC4LCDRgtC+INCy0YHQtSDRgNCw0LLQvdC+INC30LDQs9GA0YPQt9C40YLRjFxyXG5cdFx0XHRmYWtlSW1hZ2Uub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdFx0X3NldFBlcmNlbnRzKGltYWdlc0FycmF5Lmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnYm9keS1wcmVsb2FkJyk7XHJcblxyXG5cdFx0XHQvL9GCLtC6LiDQvNC10YLQvtC0IC5tYXAoKSDQstC+0LfQstGA0LDRidCw0LXRgiDQvtCx0YrQtdC60YIsINGC0L4g0L/RgNC10L7QsdGA0LDQt9GD0LXQvCDQtdCz0L4g0LIg0LzQsNGB0YHQuNCyXHJcblx0XHRcdHZhciBpbWdzQXJyYXkgPSBfaW1nUGF0aC50b0FycmF5KCk7XHJcblxyXG5cdFx0XHRfbG9hZEltYWdlcyhpbWdzQXJyYXkpO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoKTtcclxuIiwiLy8tLS0gTWFpbiBNZW51IE1vZHVsZSAtLS0tLS0tLS0tLS0tLy9cclxuXHJcbnZhciBNYWluTWVudSA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgX2NsaWNrSGFtYnVyZ2VyID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbmF2ID0gJCgnLm5hdmlnYXRpb24nKTtcclxuXHJcblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ2JvZHktYWN0aXZlJyk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLm1haW4tbWVudScpLnRvZ2dsZUNsYXNzKCdtYWluLW1lbnUtYWN0aXZlJyk7XHJcblx0XHR9LCAzMDApO1xyXG5cdFx0bmF2LnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xyXG5cclxuXHRcdCQoJy5oYW1idXJnZXInKS50b2dnbGVDbGFzcygnb24nKTtcclxuXHRcdCQoJy5oYW1idXJnZXItbWVudScpLnRvZ2dsZUNsYXNzKCdhbmltYXRlJyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJy5oYW1idXJnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRfY2xpY2tIYW1idXJnZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59KSgpO1xyXG4iLCIvLy0tLS0tU0xJREVSIE1PRFVMRS0tLS0tLy9cclxuXHJcbnZhciBTbGlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBzbGlkZXJDb250YWluZXIgPSAkKCcud29ya3NfX3NsaWRlcl9fY29udGFpbmVyJyksXHJcblx0XHRwcmV2QnRuID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX25hdl9fbGlua19wcmV2JyksXHJcblx0XHRuZXh0QnRuID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX25hdl9fbGlua19uZXh0JyksXHJcblx0XHRwcmV2U2xpZGVySXRlbXMgPSBwcmV2QnRuLmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpLFxyXG5cdFx0bmV4dFNsaWRlckl0ZW1zID0gbmV4dEJ0bi5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKSxcclxuXHRcdGl0ZW1zTGVuZ3RoID0gcHJldlNsaWRlckl0ZW1zLmxlbmd0aCxcclxuXHRcdGRpc3BsYXkgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW1nJyksXHJcblx0XHRiaWdJbWcgPSBkaXNwbGF5LmZpbmQoJy5zbGlkZXJfX2ltZ19iaWcnKSxcclxuXHRcdHRpdGxlID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2luZm9fX3N1YnRpdGxlJyksXHJcblx0XHR0ZWNobm9sb2d5ID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2luZm9fX3RlY2gnKSxcclxuXHRcdGxpbmsgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW5mb19fYnRuJyksXHJcblx0XHRkdXJhdGlvbiA9IDUwMCxcclxuXHRcdGlzQW5pbWF0ZSA9IGZhbHNlLFxyXG5cdFx0Y291bnRlciA9IDA7XHJcblxyXG5cdHZhciBfRGVmYXVsdHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vIGxlZnQgYnRuXHJcblx0XHRwcmV2QnRuXHJcblx0XHRcdC5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKVxyXG5cdFx0XHQuZXEoY291bnRlciAtIDEpXHJcblx0XHRcdC5hZGRDbGFzcygnLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xyXG5cclxuXHRcdC8vIHJpZ2h0IGJ0blxyXG5cdFx0bmV4dEJ0blxyXG5cdFx0XHQuZmluZCgnLnNsaWRlcl9fbmF2X19pdGVtJylcclxuXHRcdFx0LmVxKGNvdW50ZXIgKyAxKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3ByZXZTbGlkZUFuaW1hdGUgPSBmdW5jdGlvbihzbGlkZXJDb3VudGVyUHJldikge1xyXG5cdFx0dmFyIHJlcUl0ZW1QcmV2ID0gcHJldlNsaWRlckl0ZW1zLmVxKHNsaWRlckNvdW50ZXJQcmV2IC0gMSksXHJcblx0XHRcdGFjdGl2ZUl0ZW1QcmV2ID0gcHJldlNsaWRlckl0ZW1zLmZpbHRlcignLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xyXG5cclxuXHRcdGFjdGl2ZUl0ZW1QcmV2LmFuaW1hdGUoe1xyXG5cdFx0XHQndG9wJzogJzEwMCUnIC8vJzEwMCUnIHByZXZcclxuXHRcdH0sIGR1cmF0aW9uKTtcclxuXHJcblx0XHRyZXFJdGVtUHJldi5hbmltYXRlKHtcclxuXHRcdFx0J3RvcCc6IDBcclxuXHRcdH0sIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0YWN0aXZlSXRlbVByZXYucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpXHJcblx0XHRcdFx0LmNzcygndG9wJywgJy0xMDAlJyk7IC8vICctMTAwJScgcHJldlxyXG5cdFx0XHRcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRpc0FuaW1hdGUgPSBmYWxzZTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHZhciBfbmV4dFNsaWRlQW5pbWF0ZSA9IGZ1bmN0aW9uKHNsaWRlckNvdW50ZXJOZXh0KSB7XHJcblx0XHR2YXIgcmVxSXRlbU5leHRJbmRleCA9IHNsaWRlckNvdW50ZXJOZXh0ICsgMSxcclxuXHRcdFx0YWN0aXZlSXRlbU5leHQgPSBuZXh0U2xpZGVySXRlbXMuZmlsdGVyKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XHJcblxyXG5cdFx0aWYgKHJlcUl0ZW1OZXh0SW5kZXggPiBpdGVtc0xlbmd0aCAtIDEpIHtcclxuXHRcdFx0cmVxSXRlbU5leHRJbmRleCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHJlcUl0ZW1OZXh0ID0gbmV4dFNsaWRlckl0ZW1zLmVxKHJlcUl0ZW1OZXh0SW5kZXgpO1xyXG5cclxuXHRcdGFjdGl2ZUl0ZW1OZXh0LmFuaW1hdGUoe1xyXG5cdFx0XHQndG9wJzogJy0xMDAlJyAvLyctMTAwJScgbmV4dFxyXG5cdFx0fSwgZHVyYXRpb24pO1xyXG5cclxuXHRcdHJlcUl0ZW1OZXh0LmFuaW1hdGUoe1xyXG5cdFx0XHQndG9wJzogMFxyXG5cdFx0fSwgZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRhY3RpdmVJdGVtTmV4dC5yZW1vdmVDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJylcclxuXHRcdFx0XHQuY3NzKCd0b3AnLCAnMTAwJScpOyAvLyAnMTAwJScgbmV4dFxyXG5cdFx0XHRcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRpc0FuaW1hdGUgPSBmYWxzZTtcclxuXHRcdH0pO1xyXG5cclxuXHR9O1xyXG5cclxuXHR2YXIgX2dldERhdGEgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBkYXRhT2JqID0ge1xyXG5cdFx0XHRpbWFnZXMgOiBbXSxcclxuXHRcdFx0dGl0bGVzIDogW10sXHJcblx0XHRcdHRlY2hub2xvZ3lzIDogW10sXHJcblx0XHRcdGxpbmtzIDogW11cclxuXHRcdH07XHJcblxyXG5cdFx0cHJldlNsaWRlckl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7IC8vZWFjaCBmcm9tICdwcmV2U2xpZGVySXRlbXMnXHJcblxyXG5cdFx0XHRkYXRhT2JqLmltYWdlcy5wdXNoKCR0aGlzLmRhdGEoJ3NyYycpKTtcclxuXHRcdFx0ZGF0YU9iai50aXRsZXMucHVzaCgkdGhpcy5kYXRhKCd0aXRsZScpKTtcclxuXHRcdFx0ZGF0YU9iai50ZWNobm9sb2d5cy5wdXNoKCR0aGlzLmRhdGEoJ3RlY2gnKSk7XHJcblx0XHRcdGRhdGFPYmoubGlua3MucHVzaCgkdGhpcy5kYXRhKCdsaW5rJykpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFPYmo7XHJcblx0fTtcclxuXHJcblx0dmFyIF9jaGFuZ2VEYXRhID0gZnVuY3Rpb24oY2hhbmdlRGF0YUNvdW50ZXIpIHtcclxuXHRcdHZhciBfZGF0YSA9IF9nZXREYXRhKCk7XHJcblxyXG5cdFx0YmlnSW1nXHJcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXHJcblx0XHRcdC5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmF0dHIoJ3NyYycsIF9kYXRhLmltYWdlc1tjaGFuZ2VEYXRhQ291bnRlcl0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuZmFkZUluKGR1cmF0aW9uKTtcclxuXHJcblx0XHR0aXRsZVxyXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxyXG5cdFx0XHQuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCh0aGlzKS50ZXh0KF9kYXRhLnRpdGxlc1tjaGFuZ2VEYXRhQ291bnRlcl0pXHJcblx0XHRcdH0pXHJcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXHJcblx0XHRcdC5mYWRlSW4oZHVyYXRpb24pO1xyXG5cclxuXHRcdHRlY2hub2xvZ3lcclxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcclxuXHRcdFx0LmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQodGhpcykudGV4dChfZGF0YS50ZWNobm9sb2d5c1tjaGFuZ2VEYXRhQ291bnRlcl0pXHJcblx0XHRcdH0pXHJcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXHJcblx0XHRcdC5mYWRlSW4oZHVyYXRpb24pO1xyXG5cclxuXHRcdGxpbmsuYXR0cignaHJlZicsIF9kYXRhLmxpbmtzW2NoYW5nZURhdGFDb3VudGVyXSk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9tb3ZlU2xpZGUgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcclxuXHRcdHZhciBkaXJlY3Rpb25zID0ge1xyXG5cdFx0XHRuZXh0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKGNvdW50ZXIgPCBpdGVtc0xlbmd0aCAtIDEpIHtcclxuXHRcdFx0XHRcdGNvdW50ZXIrKztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y291bnRlciA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwcmV2IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKGNvdW50ZXIgPiAwKSB7XHJcblx0XHRcdFx0XHRjb3VudGVyLS07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvdW50ZXIgPSBpdGVtc0xlbmd0aCAtIDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdGRpcmVjdGlvbnNbZGlyZWN0aW9uXSgpO1xyXG5cclxuXHJcblx0XHRpZighaXNBbmltYXRlKSB7XHJcblxyXG5cdFx0XHRpc0FuaW1hdGUgPSB0cnVlO1xyXG5cclxuXHRcdFx0X25leHRTbGlkZUFuaW1hdGUoY291bnRlcik7XHJcblx0XHRcdF9wcmV2U2xpZGVBbmltYXRlKGNvdW50ZXIpO1xyXG5cdFx0XHRfY2hhbmdlRGF0YShjb3VudGVyKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdF9EZWZhdWx0cygpO1xyXG5cclxuXHRcdFx0JCgnLnNsaWRlcl9fbmF2X19saW5rX3ByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRfbW92ZVNsaWRlKCdwcmV2Jyk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JCgnLnNsaWRlcl9fbmF2X19saW5rX25leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRfbW92ZVNsaWRlKCduZXh0Jyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoKTsiLCIvLy0tLS0tIEJsb2ctTWVudSBNb2R1bGUgLS0tLS0tLy9cclxuXHJcbnZhciBCbG9nTWVudSA9IChmdW5jdGlvbigpIHtcclxuXHRcclxuXHR2YXIgc2lkZWJhciA9ICQoJy5zaWRlYmFyX19jb250YWluZXInKSxcclxuXHRcdHNpZGViYXJUYWJsZXQgPSAkKCcuc2lkZWJhcl9fY29udGFpbmVyX3RhYmxldCcpLFxyXG5cdFx0YXJ0aWNsZXMgPSAkKCcuYXJ0aWNsZScpLFxyXG5cdFx0Ym9keSA9IGRvY3VtZW50LmJvZHksXHJcblx0XHRhcnRpY2xlUG9zaXRpb25zQXJyYXkgPSBbXTsgLy/Qv9GD0YHRgtC+0Lkg0LzQsNGB0YHQuNCyINC00LvRjyDQutC+0L7RgNC00LjQvdCw0YIg0YHRgtCw0YLQtdC5XHJcblxyXG5cclxuXHR2YXIgX0ZpeGVkTWVudSA9IGZ1bmN0aW9uKGVsZW1lbnRUb3ApIHtcclxuXHJcblx0XHRzaWRlYmFyLmFkZENsYXNzKCdmaXhlZCcpO1xyXG5cdFx0c2lkZWJhclRhYmxldC5hZGRDbGFzcygnZml4ZWQnKTtcclxuXHRcdFxyXG5cdFx0dmFyXHRzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdG1lbnVUb3BQb3NpdGlvbiA9IE1hdGgubWF4KDE1LCBlbGVtZW50VG9wIC0gc2Nyb2xsVG9wKTsgLy/QstC10YDQvdC10YIg0L3QsNC40LHQvtC70YzRiNC10LVcclxuXHJcblx0XHRzaWRlYmFyLmNzcygndG9wJywgbWVudVRvcFBvc2l0aW9uKTtcclxuXHRcdHNpZGViYXJUYWJsZXQuY3NzKCd0b3AnLCBtZW51VG9wUG9zaXRpb24pO1xyXG5cdH07XHJcblxyXG5cdHZhciBfRmlsbEFydGljbGVQb3NpdGlvbnNBcnJheSA9IGZ1bmN0aW9uKCkgeyAvLyDQvdCw0L/QvtC70L3Rj9C10Lwg0L/Rg9GB0YLQvtC5INC80LDRgdGB0LjQsiDQvtCx0YrQtdC60YLQsNC80Lgg0YHQviDRgdCy0L7QudGB0YLQstCw0LzQuCAo0L/QvtC30LjRhtC40Y/QvNC4INGB0YLQsNGC0LXQuSlcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGFydGljbGVQb3NpdGlvbnNBcnJheVtpXSA9IHt9OyAvLyDQutCw0LbQtNGL0Lkg0Y3Qu9C10LzQtdC90YIg0LzQsNGB0YHQuNCy0LAg0LTQtdC70LDQtdC8INC+0LHRitC10LrRgtC+0LxcclxuICAgICAgICAgICAgYXJ0aWNsZVBvc2l0aW9uc0FycmF5W2ldLnRvcCA9IGFydGljbGVzLmVxKGkpLm9mZnNldCgpLnRvcCAtIDEwMDsgLy8g0YHQstC+0LnRgdGC0LLQviDQvtCx0YrQtdC60YLQsFxyXG4gICAgICAgICAgICBhcnRpY2xlUG9zaXRpb25zQXJyYXlbaV0uYm90dG9tID0gYXJ0aWNsZVBvc2l0aW9uc0FycmF5W2ldLnRvcCArIGFydGljbGVzLmVxKGkpLmlubmVySGVpZ2h0KCk7IC8vINGB0LLQvtC50YHRgtCy0L4g0L7QsdGK0LXQutGC0LBcclxuXHRcdH1cdFx0XHJcblx0fTtcclxuXHJcblx0dmFyIF9QYWdlU2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHBhZ2VTY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnRpY2xlUG9zaXRpb25zQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHBhZ2VTY3JvbGxUb3AgPj0gYXJ0aWNsZVBvc2l0aW9uc0FycmF5W2ldLnRvcCAmJiBwYWdlU2Nyb2xsVG9wIDw9IGFydGljbGVQb3NpdGlvbnNBcnJheVtpXS5ib3R0b20pIHtcclxuXHRcdFx0XHR2YXIgcmVxTGluayA9ICQoJy5zaWRlYmFyX19pdGVtJykuZXEoaSkuZmluZCgnLnNpZGViYXJfX2xpbmsnKSxcclxuXHRcdFx0XHRcdG90aGVyTGlua3MgPSByZXFMaW5rLmNsb3Nlc3QoJy5zaWRlYmFyX19pdGVtJykuc2libGluZ3MoKS5maW5kKCcuc2lkZWJhcl9fbGluaycpLFxyXG5cdFx0XHRcdFx0cmVxTGlua1RhYmxldCA9ICQoJy5ibG9nX19zaWRlYmFyX3RhYmxldCcpLmZpbmQoJy5zaWRlYmFyX19pdGVtJykuZXEoaSkuZmluZCgnLnNpZGViYXJfX2xpbmsnKSxcclxuXHRcdFx0XHRcdG90aGVyTGlua3NUYWJsZXQgPSByZXFMaW5rVGFibGV0LmNsb3Nlc3QoJy5zaWRlYmFyX19pdGVtJykuc2libGluZ3MoKS5maW5kKCcuc2lkZWJhcl9fbGluaycpO1xyXG5cclxuXHRcdFx0XHRyZXFMaW5rLmFkZENsYXNzKCdzaWRlYmFyX19saW5rX2FjdGl2ZScpO1xyXG5cdFx0XHRcdHJlcUxpbmtUYWJsZXQuYWRkQ2xhc3MoJ3NpZGViYXJfX2xpbmtfYWN0aXZlJyk7XHJcblx0XHRcdFx0b3RoZXJMaW5rcy5yZW1vdmVDbGFzcygnc2lkZWJhcl9fbGlua19hY3RpdmUnKTtcclxuXHRcdFx0XHRvdGhlckxpbmtzVGFibGV0LnJlbW92ZUNsYXNzKCdzaWRlYmFyX19saW5rX2FjdGl2ZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dmFyIF9JdGVtQ2xpY2sgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIHJlcVNpZGViYXJMaW5rID0gJCh0aGlzKSxcclxuXHRcdFx0cmVxU2lkZWJhckl0ZW0gPSByZXFTaWRlYmFyTGluay5jbG9zZXN0KCcuc2lkZWJhcl9faXRlbScpLFxyXG5cdFx0XHRyZXFJdGVtSW5kZXggPSByZXFTaWRlYmFySXRlbS5pbmRleCgpLCAvLyDQuNC90LTQtdC60YEg0YLQtdC60YPRidC10LPQviDQu9C40L3Qui3RjdC70LXQvNC10L3RgtCwXHJcblx0XHRcdG90aGVyU2lkZWJhckl0ZW1zID0gcmVxU2lkZWJhckl0ZW0uc2libGluZ3MoKSxcclxuXHRcdFx0b3RoZXJTaWRlYmFyTGlua3MgPSBvdGhlclNpZGViYXJJdGVtcy5maW5kKCcuc2lkZWJhcl9fbGluaycpLFxyXG5cdFx0XHRhcnRpY2xlcyA9ICQoJy5hcnRpY2xlJyksXHJcblx0XHRcdHJlcUFydGljbGUgPSBhcnRpY2xlcy5lcShyZXFJdGVtSW5kZXgpLFxyXG5cdFx0XHRyZXFBcnRpY2xlT2Zmc2V0VG9wID0gcmVxQXJ0aWNsZS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdG90aGVyQXJ0aWNsZXMgPSByZXFBcnRpY2xlLnNpYmxpbmdzKCk7XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9mZignc2Nyb2xsJywgX1BhZ2VTY3JvbGwpO1xyXG5cclxuXHRcdCQoJ2JvZHksIGh0bWwnKS5hbmltYXRlKHtcclxuXHRcdFx0J3Njcm9sbFRvcCc6IHJlcUFydGljbGVPZmZzZXRUb3BcclxuXHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXFTaWRlYmFyTGluay5hZGRDbGFzcygnc2lkZWJhcl9fbGlua19hY3RpdmUnKTtcclxuXHRcdFx0cmVxQXJ0aWNsZS5hZGRDbGFzcygnYXJ0aWNsZV9hY3RpdmUnKTtcclxuXHRcdFx0b3RoZXJTaWRlYmFyTGlua3MucmVtb3ZlQ2xhc3MoJ3NpZGViYXJfX2xpbmtfYWN0aXZlJyk7XHJcblx0XHRcdG90aGVyQXJ0aWNsZXMucmVtb3ZlQ2xhc3MoJ2FydGljbGVfYWN0aXZlJyk7XHJcblxyXG5cdFx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9QYWdlU2Nyb2xsKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHR2YXIgc2lkZWJhck9mZnNldFRvcCA9IHNpZGViYXIub2Zmc2V0KCkudG9wOyAvLyDRgtC+0L8t0LrQvtC+0YDQtNC40L3QsNGC0LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC90LDRh9Cw0LvQsCDRgdGC0YDQsNC90LjRhtGLXHJcblx0XHRcdHZhciBzaWRlYmFyVGFibGV0T2Zmc2V0VG9wID0gc2lkZWJhclRhYmxldC5vZmZzZXQoKS50b3A7XHJcblxyXG5cdFx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9GaXhlZE1lbnUoc2lkZWJhck9mZnNldFRvcCk7XHJcblx0XHRcdFx0X0ZpeGVkTWVudShzaWRlYmFyVGFibGV0T2Zmc2V0VG9wKTtcdFx0XHRcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9QYWdlU2Nyb2xsKCk7XHRcdFx0XHRcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRfRmlsbEFydGljbGVQb3NpdGlvbnNBcnJheSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoJy5zaWRlYmFyX19saW5rJykub24oJ2NsaWNrJywgX0l0ZW1DbGljayk7XHJcblxyXG5cdFx0XHQkKCcuc2lkZWJhcl9fZGlza190YWJsZXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdCQodGhpcykucGFyZW50cygnLmJsb2dfX3NpZGViYXJfdGFibGV0JykudG9nZ2xlQ2xhc3MoJ2Jsb2dfX3NpZGViYXJfdGFibGV0X2Nsb3NlZCcpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn0pKCk7IiwiLy8gLS0tLSBNT0RVTEVTIElOSVRJQUxJWkFUSU9OIC0tLS0tIC8vXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHRQcmVsb2FkZXIuaW5pdCgpO1xyXG5cclxuXHRpZiAoJCgnI2hhbWJ1cmdlcicpLmxlbmd0aCkge1xyXG5cdFx0TWFpbk1lbnUuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0aWYgKCQoJy5hcnJvdy1kb3duJykubGVuZ3RoKSB7XHJcblx0XHRUZXN0LmluaXQoKTtcclxuXHR9XHJcblxyXG5cdGlmICgkKCcjd29ya3NfX3NsaWRlcicpLmxlbmd0aCkge1xyXG5cdFx0U2xpZGVyLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdGlmICgkKCcjYmxvZycpLmxlbmd0aCkge1xyXG5cdFx0QmxvZ01lbnUuaW5pdCgpO1xyXG5cdH1cclxufSk7Il19
