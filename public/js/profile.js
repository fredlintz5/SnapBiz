// hacky user auth
let userId = location.href.split('/');
let userVerify = userId[userId.length - 1]

if (!sessionStorage.verify || sessionStorage.user !== userVerify) {
	window.location = '/';
} 


$(document).ready(function() {

	if ($(window).width() <= 450) {
		$("#fileLabel").text("Take a Pic of Business Card");
		$('#desktopView').addClass('hide');
	} else {
		$("#fileLabel").text("Upload Business Card Image");
		$('#desktopView').removeClass('hide');
	}

	$(window).resize(function() {
		if ($(window).width() <= 450) {
			$("#fileLabel").text("Take a Pic of Business Card");
			$('#desktopView').addClass('hide');
		} else {
			$("#fileLabel").text("Upload Business Card Image");
			$('#desktopView').removeClass('hide');
		}
	});

	getUserName();
	
	getTableData();
	
	

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

	$('#deleteButt').on('click', function() {
		$('#input-group').toggleClass('hide');
		$('#deleteButt').toggleClass('hide');
	});

	$('#cancelDelete').on('click', function() {
		$('#input-group').toggleClass('hide');
		$('#deleteButt').toggleClass('hide');
	});

	$('#confirmDelete').on('click', function() {
		let input = parseInt($('#deleteProspect').val().trim());

		if (input != input) {
			$('#deleteProspect').css('border-color', 'red');
			$('#deleteProspect').val('');
			$('#deleteProspect').attr('placeholder', 'Please only use Integers');
		} else {
			$.ajax({
				url: '/user/:id/deleteProspect',
				type: 'DELETE',
				data: {id: input},
			})
			.done(function(result) {
				if (result === 'success') {
					$('#tbody').empty();
					$('#deleteProspect').val('');
					$('#input-group').toggleClass('hide');
					$('#deleteButt').toggleClass('hide');
					getTableData();
				} else {
					alert('Incorrect Id submitted, try again');
				}
			})
		}
	});




	// Submit business-card button & grab text from card
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
			$.ajax({
				url: `/user/${userId}/newProspect`,
				type: 'POST',
				data: newProspect,
			})
			.done(function(response) {
				if (response === "success") {
					$('#dynamicForm').empty();
					$('#dynamicForm').html("<p class='text-center'>Successful Database Upload</p>");
					$('#tbody').empty();
					getTableData();
				} else {
					$('#dynamicForm').empty();
					$('#dynamicForm').html("<p class='text-center'>Database Upload Failed</p>");
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
	$('#dynamicForm').append(`<br><button type="button" id="formSubmit" class="btn btn-default">Submit</button>`);
}


function getTableData() {
	$.ajax({
	url: `/user/${sessionStorage.user}/mostRecentProspects`,
	type: 'GET',
	})
	.done(function(result) {
		for (var i = 0; i < 10; i++) {
			let newRow = 
				`<tr>
					<td>${result[i].id}</td>
			        <td>${result[i].firstName}</td>
			        <td>${result[i].lastName}</td>
                    <td>${result[i].title}</td>
                    <td>${result[i].company}</td>
                    <td>${result[i].email}</td>
                    <td>${result[i].mobile}</td>
                    <td>${result[i].work}</td>
				</tr>`;
		$('#tbody').append(newRow);result[i]
		}
	});
}

function getUserName() {
	$.get(`/user/${sessionStorage.user}/info`, function(data) {
		$('#welcomeUser').text(`Welcome ${data.name}`);
	});
}


});
