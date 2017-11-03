// hacky user auth
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
	

	// once file is uploaded send to google vision api for deciphering
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


	// Submit card button: input response grab
	$('#dynamicForm').on('click', 'button', function() {

		let newProspect = {UserId: sessionStorage.user};

		for (var i = 1; i < num; i++) {
			let ans = $(`#fgSelect${i}`).val().trim();

			switch (ans) {
				case 'null': 
					$(`#fgSelect${i}`).css('border-color', 'red');
					break;
				case 'delete': 
					break;
				case 'name': 
					$(`#fgInput${i}`).addClass('nameExists');
					let fullName = $(`#fgInput${i}`).val().trim();
					let nameArray = fullName.split(" ");
					newProspect.firstName = nameArray[0];
					newProspect.lastName = nameArray[1];
					break;
				case 'title': 
					newProspect.title = $(`#fgInput${i}`).val().trim();
					break;
				case 'company': 
					newProspect.company = $(`#fgInput${i}`).val().trim();
					break;
				case 'email': 
					newProspect.email = $(`#fgInput${i}`).val().trim();
					break;
				case 'mobilePhone': 
					newProspect.mobile = $(`#fgInput${i}`).val().trim();
					break;
				case 'workPhone': 
					newProspect.work = $(`#fgInput${i}`).val().trim();	
					break;
				case 'address': 
					newProspect.address = $(`#fgInput${i}`).val().trim();	
					break;
				case 'city': 
					newProspect.city = $(`#fgInput${i}`).val().trim();	
					break;
				case 'state': 
					newProspect.state = $(`#fgInput${i}`).val().trim();	
					break;
				case 'zip': 
					newProspect.zip = $(`#fgInput${i}`).val().trim();
					break;
			}
		}
		
		if (document.getElementsByClassName("nameExists")[0]) {
			console.log(newProspect);
			$.ajax({
				url: `/user/${userId}/newProspect`,
				type: 'POST',
				data: newProspect,
			})
			.done(function(response) {
				if (response === "success") {
					$('#dynamicForm').empty();
					$('#dynamicForm').html('<p>Succesful Database Upload</p>');
				} else {
					$('#dynamicForm').empty();
					$('#dynamicForm').html('<p>Database Upload Failed! Try again.</p>');
				}
			})
			
		} else {
			alert("Name Value cannot be null");
		}
	})


function renderInputs(string) {
	let stringArray = string.split('\n');
	num = 1;

	stringArray.forEach(function(item) {
		let newFormGroup = 
			`<div class="form-group">
				<select id='fgSelect${num}'>
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
				<input type="text" class="form-control" id='fgInput${num}' value='${item}'>
			</div>`;
		$('#dynamicForm').append(newFormGroup);
		num++;
	});
	$('#dynamicForm').append(`<button type="button" id="formSubmit" class="btn btn-default">Submit</button>`);
}



});
