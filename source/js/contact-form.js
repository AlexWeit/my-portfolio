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