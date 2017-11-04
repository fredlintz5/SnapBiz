

// $(window).resize(function() {

//   if ($(this).width() <= 450) {

//     $('.logo').hide();

//   } else {

//     $('.logo').show();

//     }
// $(window).resize(function() {
// 	if ($(window).width() <= 450) {
// 		$(".display_3").text("Welcome to SnapBiz");
// 	} else {
// 		$(".display-3").text("Welcome to ");
// 	}

// });


$('#clickMe').click(() => {
	$('#loginModal').modal('toggle');
});


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
		$('#inputEmail').val("");
		$('#inputPassword').val("");

		if (result === 'noUserFound') {
			$('#inputEmail').toggleClass('warning');
			$('#inputPassword').toggleClass('warning');
			$('#inputEmail').attr('placeholder', 'User Not found');
			$('#inputPassword').attr('placeholder', 'Try again, or sign up as new user!');
			setTimeout(function(){
				$('#inputEmail').toggleClass('warning');
				$('#inputPassword').toggleClass('warning');
				$('#inputEmail').attr('placeholder', 'Email');
				$('#inputPassword').attr('placeholder', 'Password');
			},2000)
		} else {
			sessionStorage.verify = true;
			sessionStorage.user = result;
			window.location = `/user/${result}`;
		}
	})
})


$('#loginNewUser').on('click', function(event) {
	event.preventDefault();
	$('#inputName').toggleClass('hide');
	$('#loginSubmit').toggleClass('hide');
	$('#loginNewUser').toggleClass('hide');
	$('#loginSignUp').toggleClass('hide');
})


$('#loginSignUp').on('click', function(event) {
	event.preventDefault();

	if ($('#inputName').val() === "") {
		$('#inputName').toggleClass('warning');
	} else if ($('#inputEmail').val() === "") {
		$('#inputName').toggleClass('warning');
		$('#inputEmail').toggleClass('warning');
	} else if ($('#inputPassword').val() === "") {
		$('#inputEmail').toggleClass('warning');
		$('#inputPassword').toggleClass('warning');
	} else {

		let newUser = {
			name: $('#inputName').val().trim(),
			email: $('#inputEmail').val().trim(),
			pass: $('#inputPassword').val().trim(),
		};

		$.ajax({
			url: '/newUser',
			type: 'POST',
			data: newUser,
		})
		.done(function(result) {
			if (result === 'email') {
				$('#inputEmail').toggleClass('warning');
				$('#inputEmail').attr('placeholder', 'Check Email Format, and try again');
			} else {
				sessionStorage.verify = true;
				sessionStorage.user = result;
				window.location = `/user/${result}`;
			}
		})
	}
})







