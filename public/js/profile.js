
// let userId = location.href.split('/');
// let userVerify = userId[userId.length - 1]


// if (!sessionStorage.verify || sessionStorage.user !== userVerify) {
// 	window.location = '/';
// } 


$(document).ready(function() {
	

	$('#uploadImageButton').on('click', function(event) {
		
		event.preventDefault();

		let input = $('sampleFile');

		console.log("click");
		console.log(input.files[0]);

		// $.ajax({
		// 	url: '/upload',
		// 	type: 'POST)',
		// 	data: file,
		// })
		// .done(function() {
		// 	console.log("success");
		// })
	});





});
