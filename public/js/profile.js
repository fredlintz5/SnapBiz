let userId = location.href.split('/');
let userVerify = userId[userId.length - 1]

if (!sessionStorage.verify || sessionStorage.user !== userVerify) {
	window.location = '/';
} 


$(document).ready(function() {

	if ($(window).width() <= 450) {
		$("#fileLabel").text("Take a Pic of Business Card");
	} else {
		$("#fileLabel").text("Upload Business Card Image");
	}

	$(window).resize(function() {
		if ($(window).width() <= 450) {
			$("#fileLabel").text("Take a Pic of Business Card");
		} else {
			$("#fileLabel").text("Upload Business Card Image");
		}
	});
	

	$('#sampleFile').on('change', function(event) {

		$('#dynamicForm').empty();

		var form = new FormData();
		form.append('sampleFile', $(this)[0].files[0]); 

		$.ajax({
	        url: '/upload',
	        method: "POST",
	        dataType: 'json',
	        data: form,
	        processData: false,
	        contentType: false
		})
		.done(function(result) {
			renderInputs(result);
		})
	});


function renderInputs(string) {
	let stringArray = string.split('\n');
	num = 1;

	stringArray.forEach(function(item) {

		let newFormGroup = 
			`<div class="form-group">
				<select id='fgid${num}'>
					<option value="null">Select a Value</option>
					<option value="delete">Delete Input</option>
					<option value="name">Name</option>
					<option value="title">Title</option>
					<option value="company">Company</option>
					<option value="email">Email</option>
					<option value="mobilePhone">Mobile Phone</option>
					<option value="workPhone">Work Phone</option>
					<option value="address">Address</option>
					<option value="city">City</option>
					<option value="state">State</option>
					<option value="zip">Zip</option>
				</select>
				<input type="text" class="form-control" value='${item}'>
			</div>`;

		$('#dynamicForm').append(newFormGroup);
		num++;
	});

	$('#dynamicForm').append(`<button type="button" id="formSubmit" class="btn btn-default">Submit</button>`);
}





});
