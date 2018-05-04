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
//----- Contact-Form Module ------//

var ContactForm = (function() {

	var form = $('.contact-form__input-group'),
		inputName = $('#contact-form__input__name'),
		inputEmail = $('#contact-form__input__email'),
		inputMessage = $('#contact-form__input__message'),
		btnSubmit = form.find('.btn_submit'),
		btnReset = form.find('.btn_reset'),
		popUp = $('.popup'),
		popUpText = $('.popup_text'),
		popUpClose = $('.popup_close');

	var _clickSubmit = function() {

		var nameValue = inputName.val(),
			emailValue = inputEmail.val(),
			messageValue = inputMessage.val();

		if (!nameValue === true || !emailValue === true || !messageValue === true) {

			popUpText.html('Заполните все поля!');
			popUp.addClass('popup_active');
		
		} else {

			var email_reg = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

			if (!email_reg.test(inputEmail.val())) {

		        inputEmail.css('border-color', 'red');
		        popUpText.html('E-mail введён неверно!');
		        popUp.addClass('popup_active');
		        setInterval(function() {
					popUp.removeClass('popup_active');
				}, 10000);

		    } else {
		    	$.ajax({
					url: '../assets/php/contact-form.php',
					method: 'post',
					data: {
						name: nameValue,
						email: emailValue,
						message: messageValue
					}
				}).done(function(response) {
					console.log('done');
					popUpText.html('Сообщение отправлено!');
					popUp.addClass('popup_active');
					_reset();
					setInterval(function() {
						popUp.removeClass('popup_active');
					}, 10000);
				}).fail(function(error) {
					console.log('error');
					popUpText.html('Произошла ошибка!');
					popUp.addClass('popup_active');
					setInterval(function() {
						popUp.removeClass('popup_active');
					}, 10000);
				});	
		    }
		}		
	};

	var _reset = function() {
		inputName.val('');
		inputEmail.val('');
		inputMessage.val('');
		popUp.removeClass('popup_active');
	};

	return {
		init: function() {
			$('.btn_submit').on('click', function(e) {
				e.preventDefault();

				_clickSubmit();
			});

			$('.popup').on('click', function() {

	        	popUp.removeClass('popup_active');

	        	_reset();
			});

			$('.btn_reset').on('click', function(e) {
				e.preventDefault();

				_reset();
			})
		}
	}
})();
//----- Blog-Menu Module ------//

var BlogMenu = (function() {
	
	var sidebarContainer = $('.sidebar__container'),
		sidebarTabletContainer = $('.sidebar__container_tablet'),
		articles = $('.article'),
		body = document.body,
		articlePositionsArray = []; //пустой массив для координат статей


	var _FixedMenu = function() {

		/*
		sidebarContainer.addClass('fixed');
		sidebarTabletContainer.addClass('fixed');
		
		var	scrollTop = $(window).scrollTop(),
			menuTopPosition = Math.max(15, elementTop - scrollTop); //вернет наибольшее

		sidebarContainer.css('top', menuTopPosition);
		sidebarTabletContainer.css('top', menuTopPosition);
		*/

		var	scrollTop = $(window).scrollTop();

        if (scrollTop < $('.article').offset().top) {
            sidebarContainer.removeClass('fixed');
        } else {
            sidebarContainer.addClass('fixed');
        }
	};

	var _FillArticlePositionsArray = function() { // наполняем пустой массив объектами со свойствами (позициями статей)

		for (var i = 0; i < articles.length; i++) {
			articlePositionsArray[i] = {}; // каждый элемент массива делаем объектом
            articlePositionsArray[i].top = articles.eq(i).offset().top - 150; // свойство объекта
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

			$(window).scroll(function() {
				_FixedMenu();			
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

	if($('.works__form').length) {
		ContactForm.init();
	}

	if ($('#blog').length) {
		BlogMenu.init();
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwibWFpbi1tZW51LmpzIiwic2xpZGVyLmpzIiwiY29udGFjdC1mb3JtLmpzIiwiYmxvZy1tZW51LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy0tLS0tLS0gVGVzdCBNb2R1bGUgLS0tLS0tLS0vL1xyXG5cclxudmFyIFRlc3QgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIF9mcm9tVGVzdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YWxlcnQoXCJIaSB0aGVyZSEgSSdtIGluc2lkZSBUZXN0IE1vZHVsZVwiKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnLmFycm93LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdChlKTtcclxuXHRcdFx0XHRfZnJvbVRlc3QoKTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbn0pKCk7XHJcbiIsIi8vLS0tLS0tIFByZWxvYWRlciBNb2R1bGUgLS0tLS0tLS8vXHJcblxyXG52YXIgUHJlbG9hZGVyID0gKGZ1bmN0aW9uKCkge1xyXG5cdFxyXG5cdHZhciBwcmVsb2FkZXIgPSAkKCcucHJlbG9hZGVyJyksXHJcblx0XHRib2R5ID0gJCgnYm9keScpLFxyXG5cdFx0cGVyY2VudHNUb3RhbCA9IDA7IC8v0YHQutC+0LvRjNC60L4g0LrQsNGA0YLQuNC90L7QuiDQt9Cw0LPRgNGD0LbQtdC90L5cclxuXHJcblx0Ly8t0J/QvtC90LDQtNC+0LHRj9GC0YHRjy06XHJcblx0XHQvLzEu0LzQtdGC0L7QtCwg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXRgiDQstGL0YfQu9C10L3Rj9GC0Ywg0L/Rg9GC0Lgg0LTQviDQutCw0YDRgtC40L3QvtC6INC4INGE0L7RgNC80LjRgNC+0LLQsNGC0Ywg0LzQsNGB0YHQuNCyXHJcblx0XHQvLzIu0LzQtdGC0L7QtCwg0LrQvtGC0YDRi9C5INGB0YfQuNGC0LDQtdGCINC4INCy0YvRgdGC0LDQstC70Y/QtdGCINC60L7Quy3QstC+INC30LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC+0YbQtdC90YLQvtCyXHJcblx0XHQvLzMu0LzQtdGC0L7QtCDQstGB0YLQsNCy0LrQuCDQutCw0YDRgtC40L3QutC4INC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRjdGC0L7Qs9C+INCy0YvRgdGH0LjRgtGL0LLQsNC90LjRjyDQv9GA0L7RhtC10L3RgtC+0LJcclxuXHJcblx0Ly8xLtC90LDQsdC+0YAg0LrQsNGA0YLQuNC90L7QulxyXG5cdHZhciBfaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuXHRcdHZhciBiYWNrZ3JvdW5kSW1nID0gJChlbGVtZW50KS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcclxuXHRcdFx0aW1nID0gJChlbGVtZW50KS5pcygnaW1nJyksXHJcblx0XHRcdHBhdGggPSAnICc7IC8v0YfQtdC8INC30LDQv9C+0LvQvdGP0YLRjFxyXG5cclxuXHRcdC8v0LXRgdC70Lgg0LHRjdC60LPRgNCw0YPQvdC0INC60LDRgNGC0LjQvdC60LAg0YHRg9GJ0LXRgdGC0LLRg9C10YJcclxuXHRcdGlmIChiYWNrZ3JvdW5kSW1nICE9ICdub25lJykge1xyXG5cdFx0XHRwYXRoID0gYmFja2dyb3VuZEltZy5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpOyAvL9C00LXQu9Cw0LXQvCDRh9C40YHRgtGL0Lkg0L/Rg9GC0Ywg0LTQviDQutCw0YDRgtC40L3QutC4XHJcblx0XHR9XHJcblxyXG5cdFx0Ly/QtdGB0LvQuCDQtdGB0YLRjCDQutCw0YDRgtC40L3QutCwXHJcblx0XHRpZiAoaW1nKSB7XHJcblx0XHRcdHBhdGggPSAkKGVsZW1lbnQpLmF0dHIoJ3NyYycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8v0LXRgdC70Lgg0L3QsNC/0L7Qu9C90LXQvdC40LUg0L3QtSDQv9GD0YHRgtC+0LVcclxuXHRcdGlmIChwYXRoKSByZXR1cm4gcGF0aFxyXG5cdH0pO1xyXG5cclxuXHQvLzIu0L/QvtGB0YfQuNGC0LDRgtGMINC/0YDQvtGG0LXQvdGCXHJcblx0dmFyIF9zZXRQZXJjZW50cyA9IGZ1bmN0aW9uKHRvdGFsUGVyY2VudCwgY3VycmVudFBlcmNlbnQpIHtcclxuXHRcdHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50UGVyY2VudCAvIHRvdGFsUGVyY2VudCAqIDEwMCk7IC8v0YfRgtC+0LHRiyDQvtC60YDRg9Cz0LvRj9C70L7RgdGMINCyINCx0L7Qu9GM0YjRg9GOINGB0YLQvtGA0L7QvdGDINC4INC00L7RhdC+0LTQuNC70L4g0LTQviAxMDAlXHJcblx0XHRcclxuXHRcdCQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50cyArICclJyk7XHJcblxyXG5cdFx0Ly/QtdGB0LvQuCAxMDAg0Lgg0LHQvtC70LXQtSAlLCDRgtC+INC/0YDRj9GH0LXQvCDQv9GA0LXQu9C+0LDQtNC10YBcclxuXHRcdGlmIChwZXJjZW50cyA+PSAxMDApIHtcclxuXHRcdFx0cHJlbG9hZGVyLmRlbGF5KDUwMCk7XHJcblx0XHRcdHByZWxvYWRlci5mYWRlT3V0KCdzbG93JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnYm9keS1wcmVsb2FkJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vMy7Qt9Cw0LPRgNGD0LfQuNGC0Ywg0LrQsNGA0YLQuNC90LrRgyDQuCDQstGB0YLQsNCy0LjRgtGMINC/0YDQvtGG0LXQvdGCXHJcblx0dmFyIF9sb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XHJcblxyXG5cdFx0Ly/QtdGB0LvQuCDQutCw0YDRgtC40L3QvtC6INC90LXRgiDQstC+0L7QsdGJ0LUsINGC0L4g0L/RgNGP0YfQtdC8INC/0YDQtdC70L7QsNC00LXRgFxyXG5cdFx0aWYgKCFpbWFnZXMubGVuZ3RoKSB7XHJcblx0XHRcdHByZWxvYWRlci5kZWxheSg1MDApO1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgnc2xvdycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ2JvZHktcHJlbG9hZCcpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvL9C10YHQu9C4INC60LDRgNGC0LjQvdC60Lgg0LXRgdGC0YwsINGC0L4g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0YHRgtCw0L3QtNCw0YDRgtC90YvQuSDQvNC10YLQvtC0INC00LvRjyDQvNCw0YHRgdC40LLQvtCyXHJcblx0XHRpbWFnZXMuZm9yRWFjaChmdW5jdGlvbihpbWFnZSwgaW5kZXgsIGltYWdlc0FycmF5KSB7XHJcblxyXG5cdFx0XHQvL9GB0L7Qt9C00LDQtdC8INC60LDRgNGC0LjQvdC60YMg0LfQsNC90L7QstC+ICjRhNC10LnQutC+0LLQvilcclxuXHRcdFx0dmFyIGZha2VJbWFnZSA9ICQoJzxpbWc+Jywge1xyXG5cdFx0XHRcdGF0dHIgOiB7XHJcblx0XHRcdFx0XHRzcmMgOiBpbWFnZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvL9C/0YDQvtCy0LXRgNGP0LXQvCDQt9Cw0LPRgNGD0LfQuNC70L7RgdGMINC70Lgg0LjQt9C+0LHRgNCw0LbQtdC90LjQtVxyXG5cdFx0XHQvL2Vycm9yIC0g0LXRgdC70Lgg0L7RiNC40LHQutCwINCyINC/0YPRgtC4INC60LDRgNGC0LjQvdC60LgsINGC0L4g0LLRgdC1INGA0LDQstC90L4g0LfQsNCz0YDRg9C30LjRgtGMXHJcblx0XHRcdGZha2VJbWFnZS5vbignbG9hZCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHBlcmNlbnRzVG90YWwrKztcclxuXHRcdFx0XHRfc2V0UGVyY2VudHMoaW1hZ2VzQXJyYXkubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRib2R5LmFkZENsYXNzKCdib2R5LXByZWxvYWQnKTtcclxuXHJcblx0XHRcdC8v0YIu0LouINC80LXRgtC+0LQgLm1hcCgpINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LHRitC10LrRgiwg0YLQviDQv9GA0LXQvtCx0YDQsNC30YPQtdC8INC10LPQviDQsiDQvNCw0YHRgdC40LJcclxuXHRcdFx0dmFyIGltZ3NBcnJheSA9IF9pbWdQYXRoLnRvQXJyYXkoKTtcclxuXHJcblx0XHRcdF9sb2FkSW1hZ2VzKGltZ3NBcnJheSk7XHJcblx0XHR9XHJcblx0fVxyXG59KSgpO1xyXG4iLCIvLy0tLSBNYWluIE1lbnUgTW9kdWxlIC0tLS0tLS0tLS0tLS0vL1xyXG5cclxudmFyIE1haW5NZW51ID0gKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBfY2xpY2tIYW1idXJnZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBuYXYgPSAkKCcubmF2aWdhdGlvbicpO1xyXG5cclxuXHRcdCQoJ2JvZHknKS50b2dnbGVDbGFzcygnYm9keS1hY3RpdmUnKTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcubWFpbi1tZW51JykudG9nZ2xlQ2xhc3MoJ21haW4tbWVudS1hY3RpdmUnKTtcclxuXHRcdH0sIDMwMCk7XHJcblx0XHRuYXYudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XHJcblxyXG5cdFx0JCgnLmhhbWJ1cmdlcicpLnRvZ2dsZUNsYXNzKCdvbicpO1xyXG5cdFx0JCgnLmhhbWJ1cmdlci1tZW51JykudG9nZ2xlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnLmhhbWJ1cmdlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdF9jbGlja0hhbWJ1cmdlcigpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn0pKCk7XHJcbiIsIi8vLS0tLS1TTElERVIgTU9EVUxFLS0tLS0vL1xyXG5cclxudmFyIFNsaWRlciA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIHNsaWRlckNvbnRhaW5lciA9ICQoJy53b3Jrc19fc2xpZGVyX19jb250YWluZXInKSxcclxuXHRcdHByZXZCdG4gPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9fbmF2X19saW5rX3ByZXYnKSxcclxuXHRcdG5leHRCdG4gPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9fbmF2X19saW5rX25leHQnKSxcclxuXHRcdHByZXZTbGlkZXJJdGVtcyA9IHByZXZCdG4uZmluZCgnLnNsaWRlcl9fbmF2X19pdGVtJyksXHJcblx0XHRuZXh0U2xpZGVySXRlbXMgPSBuZXh0QnRuLmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpLFxyXG5cdFx0aXRlbXNMZW5ndGggPSBwcmV2U2xpZGVySXRlbXMubGVuZ3RoLFxyXG5cdFx0ZGlzcGxheSA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pbWcnKSxcclxuXHRcdGJpZ0ltZyA9IGRpc3BsYXkuZmluZCgnLnNsaWRlcl9faW1nX2JpZycpLFxyXG5cdFx0dGl0bGUgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW5mb19fc3VidGl0bGUnKSxcclxuXHRcdHRlY2hub2xvZ3kgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW5mb19fdGVjaCcpLFxyXG5cdFx0bGluayA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pbmZvX19idG4nKSxcclxuXHRcdGR1cmF0aW9uID0gNTAwLFxyXG5cdFx0aXNBbmltYXRlID0gZmFsc2UsXHJcblx0XHRjb3VudGVyID0gMDtcclxuXHJcblx0dmFyIF9EZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gbGVmdCBidG5cclxuXHRcdHByZXZCdG5cclxuXHRcdFx0LmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpXHJcblx0XHRcdC5lcShjb3VudGVyIC0gMSlcclxuXHRcdFx0LmFkZENsYXNzKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XHJcblxyXG5cdFx0Ly8gcmlnaHQgYnRuXHJcblx0XHRuZXh0QnRuXHJcblx0XHRcdC5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKVxyXG5cdFx0XHQuZXEoY291bnRlciArIDEpXHJcblx0XHRcdC5hZGRDbGFzcygnLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xyXG5cdH07XHJcblxyXG5cdHZhciBfcHJldlNsaWRlQW5pbWF0ZSA9IGZ1bmN0aW9uKHNsaWRlckNvdW50ZXJQcmV2KSB7XHJcblx0XHR2YXIgcmVxSXRlbVByZXYgPSBwcmV2U2xpZGVySXRlbXMuZXEoc2xpZGVyQ291bnRlclByZXYgLSAxKSxcclxuXHRcdFx0YWN0aXZlSXRlbVByZXYgPSBwcmV2U2xpZGVySXRlbXMuZmlsdGVyKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XHJcblxyXG5cdFx0YWN0aXZlSXRlbVByZXYuYW5pbWF0ZSh7XHJcblx0XHRcdCd0b3AnOiAnMTAwJScgLy8nMTAwJScgcHJldlxyXG5cdFx0fSwgZHVyYXRpb24pO1xyXG5cclxuXHRcdHJlcUl0ZW1QcmV2LmFuaW1hdGUoe1xyXG5cdFx0XHQndG9wJzogMFxyXG5cdFx0fSwgZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRhY3RpdmVJdGVtUHJldi5yZW1vdmVDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJylcclxuXHRcdFx0XHQuY3NzKCd0b3AnLCAnLTEwMCUnKTsgLy8gJy0xMDAlJyBwcmV2XHJcblx0XHRcdFxyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcclxuXHJcblx0XHRcdGlzQW5pbWF0ZSA9IGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9uZXh0U2xpZGVBbmltYXRlID0gZnVuY3Rpb24oc2xpZGVyQ291bnRlck5leHQpIHtcclxuXHRcdHZhciByZXFJdGVtTmV4dEluZGV4ID0gc2xpZGVyQ291bnRlck5leHQgKyAxLFxyXG5cdFx0XHRhY3RpdmVJdGVtTmV4dCA9IG5leHRTbGlkZXJJdGVtcy5maWx0ZXIoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcclxuXHJcblx0XHRpZiAocmVxSXRlbU5leHRJbmRleCA+IGl0ZW1zTGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRyZXFJdGVtTmV4dEluZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcmVxSXRlbU5leHQgPSBuZXh0U2xpZGVySXRlbXMuZXEocmVxSXRlbU5leHRJbmRleCk7XHJcblxyXG5cdFx0YWN0aXZlSXRlbU5leHQuYW5pbWF0ZSh7XHJcblx0XHRcdCd0b3AnOiAnLTEwMCUnIC8vJy0xMDAlJyBuZXh0XHJcblx0XHR9LCBkdXJhdGlvbik7XHJcblxyXG5cdFx0cmVxSXRlbU5leHQuYW5pbWF0ZSh7XHJcblx0XHRcdCd0b3AnOiAwXHJcblx0XHR9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGFjdGl2ZUl0ZW1OZXh0LnJlbW92ZUNsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKVxyXG5cdFx0XHRcdC5jc3MoJ3RvcCcsICcxMDAlJyk7IC8vICcxMDAlJyBuZXh0XHJcblx0XHRcdFxyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcclxuXHJcblx0XHRcdGlzQW5pbWF0ZSA9IGZhbHNlO1xyXG5cdFx0fSk7XHJcblxyXG5cdH07XHJcblxyXG5cdHZhciBfZ2V0RGF0YSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGRhdGFPYmogPSB7XHJcblx0XHRcdGltYWdlcyA6IFtdLFxyXG5cdFx0XHR0aXRsZXMgOiBbXSxcclxuXHRcdFx0dGVjaG5vbG9neXMgOiBbXSxcclxuXHRcdFx0bGlua3MgOiBbXVxyXG5cdFx0fTtcclxuXHJcblx0XHRwcmV2U2xpZGVySXRlbXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTsgLy9lYWNoIGZyb20gJ3ByZXZTbGlkZXJJdGVtcydcclxuXHJcblx0XHRcdGRhdGFPYmouaW1hZ2VzLnB1c2goJHRoaXMuZGF0YSgnc3JjJykpO1xyXG5cdFx0XHRkYXRhT2JqLnRpdGxlcy5wdXNoKCR0aGlzLmRhdGEoJ3RpdGxlJykpO1xyXG5cdFx0XHRkYXRhT2JqLnRlY2hub2xvZ3lzLnB1c2goJHRoaXMuZGF0YSgndGVjaCcpKTtcclxuXHRcdFx0ZGF0YU9iai5saW5rcy5wdXNoKCR0aGlzLmRhdGEoJ2xpbmsnKSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gZGF0YU9iajtcclxuXHR9O1xyXG5cclxuXHR2YXIgX2NoYW5nZURhdGEgPSBmdW5jdGlvbihjaGFuZ2VEYXRhQ291bnRlcikge1xyXG5cdFx0dmFyIF9kYXRhID0gX2dldERhdGEoKTtcclxuXHJcblx0XHRiaWdJbWdcclxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcclxuXHRcdFx0LmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQodGhpcykuYXR0cignc3JjJywgX2RhdGEuaW1hZ2VzW2NoYW5nZURhdGFDb3VudGVyXSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5mYWRlSW4oZHVyYXRpb24pO1xyXG5cclxuXHRcdHRpdGxlXHJcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXHJcblx0XHRcdC5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLnRleHQoX2RhdGEudGl0bGVzW2NoYW5nZURhdGFDb3VudGVyXSlcclxuXHRcdFx0fSlcclxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcclxuXHRcdFx0LmZhZGVJbihkdXJhdGlvbik7XHJcblxyXG5cdFx0dGVjaG5vbG9neVxyXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxyXG5cdFx0XHQuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCh0aGlzKS50ZXh0KF9kYXRhLnRlY2hub2xvZ3lzW2NoYW5nZURhdGFDb3VudGVyXSlcclxuXHRcdFx0fSlcclxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcclxuXHRcdFx0LmZhZGVJbihkdXJhdGlvbik7XHJcblxyXG5cdFx0bGluay5hdHRyKCdocmVmJywgX2RhdGEubGlua3NbY2hhbmdlRGF0YUNvdW50ZXJdKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX21vdmVTbGlkZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xyXG5cdFx0dmFyIGRpcmVjdGlvbnMgPSB7XHJcblx0XHRcdG5leHQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoY291bnRlciA8IGl0ZW1zTGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRcdFx0Y291bnRlcisrO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb3VudGVyID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHByZXYgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoY291bnRlciA+IDApIHtcclxuXHRcdFx0XHRcdGNvdW50ZXItLTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y291bnRlciA9IGl0ZW1zTGVuZ3RoIC0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0ZGlyZWN0aW9uc1tkaXJlY3Rpb25dKCk7XHJcblxyXG5cclxuXHRcdGlmKCFpc0FuaW1hdGUpIHtcclxuXHJcblx0XHRcdGlzQW5pbWF0ZSA9IHRydWU7XHJcblxyXG5cdFx0XHRfbmV4dFNsaWRlQW5pbWF0ZShjb3VudGVyKTtcclxuXHRcdFx0X3ByZXZTbGlkZUFuaW1hdGUoY291bnRlcik7XHJcblx0XHRcdF9jaGFuZ2VEYXRhKGNvdW50ZXIpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0X0RlZmF1bHRzKCk7XHJcblxyXG5cdFx0XHQkKCcuc2xpZGVyX19uYXZfX2xpbmtfcHJldicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdF9tb3ZlU2xpZGUoJ3ByZXYnKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKCcuc2xpZGVyX19uYXZfX2xpbmtfbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdF9tb3ZlU2xpZGUoJ25leHQnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59KSgpOyIsIi8vLS0tLS0gQ29udGFjdC1Gb3JtIE1vZHVsZSAtLS0tLS0vL1xyXG5cclxudmFyIENvbnRhY3RGb3JtID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgZm9ybSA9ICQoJy5jb250YWN0LWZvcm1fX2lucHV0LWdyb3VwJyksXHJcblx0XHRpbnB1dE5hbWUgPSAkKCcjY29udGFjdC1mb3JtX19pbnB1dF9fbmFtZScpLFxyXG5cdFx0aW5wdXRFbWFpbCA9ICQoJyNjb250YWN0LWZvcm1fX2lucHV0X19lbWFpbCcpLFxyXG5cdFx0aW5wdXRNZXNzYWdlID0gJCgnI2NvbnRhY3QtZm9ybV9faW5wdXRfX21lc3NhZ2UnKSxcclxuXHRcdGJ0blN1Ym1pdCA9IGZvcm0uZmluZCgnLmJ0bl9zdWJtaXQnKSxcclxuXHRcdGJ0blJlc2V0ID0gZm9ybS5maW5kKCcuYnRuX3Jlc2V0JyksXHJcblx0XHRwb3BVcCA9ICQoJy5wb3B1cCcpLFxyXG5cdFx0cG9wVXBUZXh0ID0gJCgnLnBvcHVwX3RleHQnKSxcclxuXHRcdHBvcFVwQ2xvc2UgPSAkKCcucG9wdXBfY2xvc2UnKTtcclxuXHJcblx0dmFyIF9jbGlja1N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBuYW1lVmFsdWUgPSBpbnB1dE5hbWUudmFsKCksXHJcblx0XHRcdGVtYWlsVmFsdWUgPSBpbnB1dEVtYWlsLnZhbCgpLFxyXG5cdFx0XHRtZXNzYWdlVmFsdWUgPSBpbnB1dE1lc3NhZ2UudmFsKCk7XHJcblxyXG5cdFx0aWYgKCFuYW1lVmFsdWUgPT09IHRydWUgfHwgIWVtYWlsVmFsdWUgPT09IHRydWUgfHwgIW1lc3NhZ2VWYWx1ZSA9PT0gdHJ1ZSkge1xyXG5cclxuXHRcdFx0cG9wVXBUZXh0Lmh0bWwoJ9CX0LDQv9C+0LvQvdC40YLQtSDQstGB0LUg0L/QvtC70Y8hJyk7XHJcblx0XHRcdHBvcFVwLmFkZENsYXNzKCdwb3B1cF9hY3RpdmUnKTtcclxuXHRcdFxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdHZhciBlbWFpbF9yZWcgPSAvXihbYS16MC05X1xcLi1dKStAW2EtejAtOS1dK1xcLihbYS16XXsyLDR9XFwuKT9bYS16XXsyLDR9JC9pO1xyXG5cclxuXHRcdFx0aWYgKCFlbWFpbF9yZWcudGVzdChpbnB1dEVtYWlsLnZhbCgpKSkge1xyXG5cclxuXHRcdCAgICAgICAgaW5wdXRFbWFpbC5jc3MoJ2JvcmRlci1jb2xvcicsICdyZWQnKTtcclxuXHRcdCAgICAgICAgcG9wVXBUZXh0Lmh0bWwoJ0UtbWFpbCDQstCy0LXQtNGR0L0g0L3QtdCy0LXRgNC90L4hJyk7XHJcblx0XHQgICAgICAgIHBvcFVwLmFkZENsYXNzKCdwb3B1cF9hY3RpdmUnKTtcclxuXHRcdCAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XHJcblx0XHRcdFx0fSwgMTAwMDApO1xyXG5cclxuXHRcdCAgICB9IGVsc2Uge1xyXG5cdFx0ICAgIFx0JC5hamF4KHtcclxuXHRcdFx0XHRcdHVybDogJy4uL2Fzc2V0cy9waHAvY29udGFjdC1mb3JtLnBocCcsXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdwb3N0JyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0bmFtZTogbmFtZVZhbHVlLFxyXG5cdFx0XHRcdFx0XHRlbWFpbDogZW1haWxWYWx1ZSxcclxuXHRcdFx0XHRcdFx0bWVzc2FnZTogbWVzc2FnZVZhbHVlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2RvbmUnKTtcclxuXHRcdFx0XHRcdHBvcFVwVGV4dC5odG1sKCfQodC+0L7QsdGJ0LXQvdC40LUg0L7RgtC/0YDQsNCy0LvQtdC90L4hJyk7XHJcblx0XHRcdFx0XHRwb3BVcC5hZGRDbGFzcygncG9wdXBfYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRfcmVzZXQoKTtcclxuXHRcdFx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9LCAxMDAwMCk7XHJcblx0XHRcdFx0fSkuZmFpbChmdW5jdGlvbihlcnJvcikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJyk7XHJcblx0XHRcdFx0XHRwb3BVcFRleHQuaHRtbCgn0J/RgNC+0LjQt9C+0YjQu9CwINC+0YjQuNCx0LrQsCEnKTtcclxuXHRcdFx0XHRcdHBvcFVwLmFkZENsYXNzKCdwb3B1cF9hY3RpdmUnKTtcclxuXHRcdFx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9LCAxMDAwMCk7XHJcblx0XHRcdFx0fSk7XHRcclxuXHRcdCAgICB9XHJcblx0XHR9XHRcdFxyXG5cdH07XHJcblxyXG5cdHZhciBfcmVzZXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlucHV0TmFtZS52YWwoJycpO1xyXG5cdFx0aW5wdXRFbWFpbC52YWwoJycpO1xyXG5cdFx0aW5wdXRNZXNzYWdlLnZhbCgnJyk7XHJcblx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuYnRuX3N1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdF9jbGlja1N1Ym1pdCgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoJy5wb3B1cCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cclxuXHQgICAgICAgIFx0cG9wVXAucmVtb3ZlQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xyXG5cclxuXHQgICAgICAgIFx0X3Jlc2V0KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JCgnLmJ0bl9yZXNldCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdF9yZXNldCgpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxufSkoKTsiLCIvLy0tLS0tIEJsb2ctTWVudSBNb2R1bGUgLS0tLS0tLy9cclxuXHJcbnZhciBCbG9nTWVudSA9IChmdW5jdGlvbigpIHtcclxuXHRcclxuXHR2YXIgc2lkZWJhckNvbnRhaW5lciA9ICQoJy5zaWRlYmFyX19jb250YWluZXInKSxcclxuXHRcdHNpZGViYXJUYWJsZXRDb250YWluZXIgPSAkKCcuc2lkZWJhcl9fY29udGFpbmVyX3RhYmxldCcpLFxyXG5cdFx0YXJ0aWNsZXMgPSAkKCcuYXJ0aWNsZScpLFxyXG5cdFx0Ym9keSA9IGRvY3VtZW50LmJvZHksXHJcblx0XHRhcnRpY2xlUG9zaXRpb25zQXJyYXkgPSBbXTsgLy/Qv9GD0YHRgtC+0Lkg0LzQsNGB0YHQuNCyINC00LvRjyDQutC+0L7RgNC00LjQvdCw0YIg0YHRgtCw0YLQtdC5XHJcblxyXG5cclxuXHR2YXIgX0ZpeGVkTWVudSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8qXHJcblx0XHRzaWRlYmFyQ29udGFpbmVyLmFkZENsYXNzKCdmaXhlZCcpO1xyXG5cdFx0c2lkZWJhclRhYmxldENvbnRhaW5lci5hZGRDbGFzcygnZml4ZWQnKTtcclxuXHRcdFxyXG5cdFx0dmFyXHRzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdG1lbnVUb3BQb3NpdGlvbiA9IE1hdGgubWF4KDE1LCBlbGVtZW50VG9wIC0gc2Nyb2xsVG9wKTsgLy/QstC10YDQvdC10YIg0L3QsNC40LHQvtC70YzRiNC10LVcclxuXHJcblx0XHRzaWRlYmFyQ29udGFpbmVyLmNzcygndG9wJywgbWVudVRvcFBvc2l0aW9uKTtcclxuXHRcdHNpZGViYXJUYWJsZXRDb250YWluZXIuY3NzKCd0b3AnLCBtZW51VG9wUG9zaXRpb24pO1xyXG5cdFx0Ki9cclxuXHJcblx0XHR2YXJcdHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKHNjcm9sbFRvcCA8ICQoJy5hcnRpY2xlJykub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgICAgIHNpZGViYXJDb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2lkZWJhckNvbnRhaW5lci5hZGRDbGFzcygnZml4ZWQnKTtcclxuICAgICAgICB9XHJcblx0fTtcclxuXHJcblx0dmFyIF9GaWxsQXJ0aWNsZVBvc2l0aW9uc0FycmF5ID0gZnVuY3Rpb24oKSB7IC8vINC90LDQv9C+0LvQvdGP0LXQvCDQv9GD0YHRgtC+0Lkg0LzQsNGB0YHQuNCyINC+0LHRitC10LrRgtCw0LzQuCDRgdC+INGB0LLQvtC50YHRgtCy0LDQvNC4ICjQv9C+0LfQuNGG0LjRj9C80Lgg0YHRgtCw0YLQtdC5KVxyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YXJ0aWNsZVBvc2l0aW9uc0FycmF5W2ldID0ge307IC8vINC60LDQttC00YvQuSDRjdC70LXQvNC10L3RgiDQvNCw0YHRgdC40LLQsCDQtNC10LvQsNC10Lwg0L7QsdGK0LXQutGC0L7QvFxyXG4gICAgICAgICAgICBhcnRpY2xlUG9zaXRpb25zQXJyYXlbaV0udG9wID0gYXJ0aWNsZXMuZXEoaSkub2Zmc2V0KCkudG9wIC0gMTUwOyAvLyDRgdCy0L7QudGB0YLQstC+INC+0LHRitC10LrRgtCwXHJcbiAgICAgICAgICAgIGFydGljbGVQb3NpdGlvbnNBcnJheVtpXS5ib3R0b20gPSBhcnRpY2xlUG9zaXRpb25zQXJyYXlbaV0udG9wICsgYXJ0aWNsZXMuZXEoaSkuaW5uZXJIZWlnaHQoKTsgLy8g0YHQstC+0LnRgdGC0LLQviDQvtCx0YrQtdC60YLQsFxyXG5cdFx0fVx0XHRcclxuXHR9O1xyXG5cclxuXHR2YXIgX1BhZ2VTY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgcGFnZVNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFydGljbGVQb3NpdGlvbnNBcnJheS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAocGFnZVNjcm9sbFRvcCA+PSBhcnRpY2xlUG9zaXRpb25zQXJyYXlbaV0udG9wICYmIHBhZ2VTY3JvbGxUb3AgPD0gYXJ0aWNsZVBvc2l0aW9uc0FycmF5W2ldLmJvdHRvbSkge1xyXG5cdFx0XHRcdHZhciByZXFMaW5rID0gJCgnLnNpZGViYXJfX2l0ZW0nKS5lcShpKS5maW5kKCcuc2lkZWJhcl9fbGluaycpLFxyXG5cdFx0XHRcdFx0b3RoZXJMaW5rcyA9IHJlcUxpbmsuY2xvc2VzdCgnLnNpZGViYXJfX2l0ZW0nKS5zaWJsaW5ncygpLmZpbmQoJy5zaWRlYmFyX19saW5rJyksXHJcblx0XHRcdFx0XHRyZXFMaW5rVGFibGV0ID0gJCgnLmJsb2dfX3NpZGViYXJfdGFibGV0JykuZmluZCgnLnNpZGViYXJfX2l0ZW0nKS5lcShpKS5maW5kKCcuc2lkZWJhcl9fbGluaycpLFxyXG5cdFx0XHRcdFx0b3RoZXJMaW5rc1RhYmxldCA9IHJlcUxpbmtUYWJsZXQuY2xvc2VzdCgnLnNpZGViYXJfX2l0ZW0nKS5zaWJsaW5ncygpLmZpbmQoJy5zaWRlYmFyX19saW5rJyk7XHJcblxyXG5cdFx0XHRcdHJlcUxpbmsuYWRkQ2xhc3MoJ3NpZGViYXJfX2xpbmtfYWN0aXZlJyk7XHJcblx0XHRcdFx0cmVxTGlua1RhYmxldC5hZGRDbGFzcygnc2lkZWJhcl9fbGlua19hY3RpdmUnKTtcclxuXHRcdFx0XHRvdGhlckxpbmtzLnJlbW92ZUNsYXNzKCdzaWRlYmFyX19saW5rX2FjdGl2ZScpO1xyXG5cdFx0XHRcdG90aGVyTGlua3NUYWJsZXQucmVtb3ZlQ2xhc3MoJ3NpZGViYXJfX2xpbmtfYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR2YXIgX0l0ZW1DbGljayA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgcmVxU2lkZWJhckxpbmsgPSAkKHRoaXMpLFxyXG5cdFx0XHRyZXFTaWRlYmFySXRlbSA9IHJlcVNpZGViYXJMaW5rLmNsb3Nlc3QoJy5zaWRlYmFyX19pdGVtJyksXHJcblx0XHRcdHJlcUl0ZW1JbmRleCA9IHJlcVNpZGViYXJJdGVtLmluZGV4KCksIC8vINC40L3QtNC10LrRgSDRgtC10LrRg9GJ0LXQs9C+INC70LjQvdC6LdGN0LvQtdC80LXQvdGC0LBcclxuXHRcdFx0b3RoZXJTaWRlYmFySXRlbXMgPSByZXFTaWRlYmFySXRlbS5zaWJsaW5ncygpLFxyXG5cdFx0XHRvdGhlclNpZGViYXJMaW5rcyA9IG90aGVyU2lkZWJhckl0ZW1zLmZpbmQoJy5zaWRlYmFyX19saW5rJyksXHJcblx0XHRcdGFydGljbGVzID0gJCgnLmFydGljbGUnKSxcclxuXHRcdFx0cmVxQXJ0aWNsZSA9IGFydGljbGVzLmVxKHJlcUl0ZW1JbmRleCksXHJcblx0XHRcdHJlcUFydGljbGVPZmZzZXRUb3AgPSByZXFBcnRpY2xlLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0b3RoZXJBcnRpY2xlcyA9IHJlcUFydGljbGUuc2libGluZ3MoKTtcclxuXHJcblx0XHQkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBfUGFnZVNjcm9sbCk7XHJcblxyXG5cdFx0JCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe1xyXG5cdFx0XHQnc2Nyb2xsVG9wJzogcmVxQXJ0aWNsZU9mZnNldFRvcFxyXG5cdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlcVNpZGViYXJMaW5rLmFkZENsYXNzKCdzaWRlYmFyX19saW5rX2FjdGl2ZScpO1xyXG5cdFx0XHRyZXFBcnRpY2xlLmFkZENsYXNzKCdhcnRpY2xlX2FjdGl2ZScpO1xyXG5cdFx0XHRvdGhlclNpZGViYXJMaW5rcy5yZW1vdmVDbGFzcygnc2lkZWJhcl9fbGlua19hY3RpdmUnKTtcclxuXHRcdFx0b3RoZXJBcnRpY2xlcy5yZW1vdmVDbGFzcygnYXJ0aWNsZV9hY3RpdmUnKTtcclxuXHJcblx0XHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0X1BhZ2VTY3JvbGwoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cdFxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0X0ZpeGVkTWVudSgpO1x0XHRcdFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0X1BhZ2VTY3JvbGwoKTtcdFx0XHRcdFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9GaWxsQXJ0aWNsZVBvc2l0aW9uc0FycmF5KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JCgnLnNpZGViYXJfX2xpbmsnKS5vbignY2xpY2snLCBfSXRlbUNsaWNrKTtcclxuXHJcblx0XHRcdCQoJy5zaWRlYmFyX19kaXNrX3RhYmxldCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuYmxvZ19fc2lkZWJhcl90YWJsZXQnKS50b2dnbGVDbGFzcygnYmxvZ19fc2lkZWJhcl90YWJsZXRfY2xvc2VkJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoKTsiLCIvLyAtLS0tIE1PRFVMRVMgSU5JVElBTElaQVRJT04gLS0tLS0gLy9cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cdFByZWxvYWRlci5pbml0KCk7XHJcblxyXG5cdGlmICgkKCcjaGFtYnVyZ2VyJykubGVuZ3RoKSB7XHJcblx0XHRNYWluTWVudS5pbml0KCk7XHJcblx0fVxyXG5cclxuXHRpZiAoJCgnLmFycm93LWRvd24nKS5sZW5ndGgpIHtcclxuXHRcdFRlc3QuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0aWYgKCQoJyN3b3Jrc19fc2xpZGVyJykubGVuZ3RoKSB7XHJcblx0XHRTbGlkZXIuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0aWYoJCgnLndvcmtzX19mb3JtJykubGVuZ3RoKSB7XHJcblx0XHRDb250YWN0Rm9ybS5pbml0KCk7XHJcblx0fVxyXG5cclxuXHRpZiAoJCgnI2Jsb2cnKS5sZW5ndGgpIHtcclxuXHRcdEJsb2dNZW51LmluaXQoKTtcclxuXHR9XHJcbn0pOyJdfQ==
