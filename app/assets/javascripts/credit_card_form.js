$(document).ready(function() {
	
	var showError, stripeResponseHandler, submitHandler;

	submitHandler = function(event) {
		var $form = $(event.target);
		$form.find("input[type=submit]").prop("disabled", true);
		// If Stripe was installed correctly this will create a token using the credit card info
		if (Stripe) {
			Stripe.card.createToken($form, stripeResponseHandler);
		} else {
			showError("Failed to load credit card processing functionality. Please reload this page.");
		}	
		return false;
	};

	$(".cc_form").on("submit", submitHandler);
	
	stripeResponseHandler = function(status, response) {
		console.log(response);
		var token, $form;
		$form = $('.cc_form');

		if (response.error) {
			// Show the errors on the form
			console.log(response.error.message);
			showError(response.error.message);
			$form.find("input[type=submit]").prop("disabled", false);
		} else {
			// response contains id and card, which contains additional card details
			token = response.id;
			// Insert the token into the form so it gets submitted to the server
			$form.append($('<input type="hidden" name="payment[token]" />').val(token));
			// Remove the credit card data from the form before hitting the server.
			$("[data-stripe=number]").remove();
			$("[data-stripe=cvv]").remove();
			$("[data-stripe=exp-year]").remove();
			$("[data-stripe=exp-month]").remove();
			$("[data-stripe=label]").remove();
			// Submit the form
			$form.get(0).submit();
		}
		return false;
	};

	showError = function(message) {
		$("div.container:nth-child(2)").prepend('<div class="alert alert-danger"><a class="close" data-dismiss="alert">&times;</a>' + message + '</div>');
		return false;
	};

	// helper function to pause javascript
	function sleep(miliseconds) {
		var currentTime = new Date().getTime();

		while (currentTime + miliseconds >= new Date().getTime()) {
		}
	}

});
