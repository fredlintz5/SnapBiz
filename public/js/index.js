


$('#loginSubmit').on('click', function(event) {
	event.preventDefault();

	let credentials = {
		email: $('#inputEmail').val().trim(),
		pass: $('#inputPassword').val().trim()
	};

	$.ajax({
		url: '/verify',
		type: 'POST',
		data: credentials,
	})
	.done(function(result) {
		if (result === 'noUserFound') {
			alert('User Not found, please check email and password, or sign up as a New User');
		} else {
			console.log(result);
			window.location = `/user/${result}`;
		}
	})
})


$('#loginNewUser').on('click', function(event) {
	event.preventDefault();
	$('#inputName').toggleClass('hide');
	$('#inputPhone').toggleClass('hide');
	$('#loginSubmit').toggleClass('hide');
	$('#loginNewUser').toggleClass('hide');
	$('#loginSignUp').toggleClass('hide');
})


$('#loginSignUp').on('click', function(event) {
	event.preventDefault();

	let newUser = {
		name: $('#inputName').val().trim(),
		email: $('#inputEmail').val().trim(),
		pass: $('#inputPassword').val().trim(),
		phone: $('#inputPhone').val().trim()
	};

	$.ajax({
		url: '/newUser',
		type: 'POST',
		data: newUser,
	})
	.done(function(result) {
		if (result === 'email') {
			alert('Please check email format and submit again');
		} else {
			window.location = `/user/${result}`;
		}
	})
})







