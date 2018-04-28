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