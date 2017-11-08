// hacky user auth
let userId = location.href.split('/');
let userVerify = userId[userId.length - 1];

if (!sessionStorage.verify || sessionStorage.user !== userVerify) {
	window.location = '/';
} 

let num;

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
	$('#dynamicForm').append(`<button type="button" id="formSubmit" class="btn btn-default">Submit</button><br>`);
}


function getTableData() {
	$.ajax({
	url: `/user/${sessionStorage.user}/mostRecentProspects`,
	type: 'GET',
	})
	.done(function(result) {
		for (var i = 0; i < result.length; i++) {
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
		$('#tbody').append(newRow);
		}
	});
}

function getUserData() {
	$.get(`/user/${sessionStorage.user}/info`, function(data) {
		let emailArray = data.email.split('');
		let nameArray = data.name.split(''); 
		// dynamically guessing left positon to center user data
		let emailLeft = (300 - (emailArray.length * 5))*.6;
		let nameLeft;

		if (nameArray.length > 15) {
			nameArray = data.name.split(' ');
			let fName = nameArray[0].split('');
			nameLeft = (300 - (fName.length * 10))*.573;
			$('#welcomeUser').text(`${nameArray[0]}`);
			$('#welcomeUser').css('left', `${nameLeft}px`);
		} else {
			nameLeft = (300 - (nameArray.length * 10))*.573;
			$('#welcomeUser').text(`${data.name}`);
			$('#welcomeUser').css('left', `${nameLeft}px`);
		}

		$('#email').text(`${data.email}`);
		$('#email').css('left', `${emailLeft}px`);
	});
}


$(document).ready(function() {

	if ($(window).width() <= 450) {
		$("#fileLabel").text("Take a Pic of Business Card");
		$('#desktopView').addClass('hide');
		$('#profileLogoutMobile').removeClass('hide');
	} else {
		$("#fileLabel").text("Upload Business Card Image");
		$('#desktopView').removeClass('hide');
		$('#profileLogoutMobile').addClass('hide');
	}

	$(window).resize(function() {
		if ($(window).width() <= 450) {
			$("#fileLabel").text("Take a Pic of Business Card");
			$('#desktopView').addClass('hide');
			$('#profileLogoutMobile').removeClass('hide');
		} else {
			$("#fileLabel").text("Upload Business Card Image");
			$('#desktopView').removeClass('hide');
			$('#profileLogoutMobile').addClass('hide');
		}
	});


	// on page load populate User Name, and table data
	getUserData();	
	getTableData();
	

	$('#profileLogoutDesktop').on('click', function() {
		sessionStorage.user = '';
		sessionStorage.verify = '';
		window.location.assign("/");
	})

	$('#profileLogoutMobile').on('click', function() {
		sessionStorage.user = '';
		sessionStorage.verify = '';
		window.location.assign("/");
	})


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
			$('#dynamicCard').toggleClass('hide');
			
			renderInputs(result);
		})
	});


	// Submit business-card button & grab text from card
	$('#dynamicForm').on('click', 'button', function() {

		let newProspect = {UserId: sessionStorage.user};

		for (var i = 1; i < num; i++) {
			let option = $(`#fgSelect${i}`).val().trim();
			let input = $(`#fgInput${i}`).val().trim();

			switch (option) {
				case 'null': 
					$(`#fgSelect${i}`).css('border-color', 'red');
					break;
				case 'delete': 
					break;
				case 'name': 
					$(`#fgInput${i}`).addClass('nameExists');
					let fullName = input;
					let nameArray = fullName.split(" ");
					newProspect.firstName = nameArray[0];
					newProspect.lastName = nameArray[1];
					break;
				case 'title': 
					newProspect.title = input;
					break;
				case 'company': 
					newProspect.company = input;
					break;
				case 'email': 
					newProspect.email = input;
					break;
				case 'mobilePhone': 
					newProspect.mobile = input;
					break;
				case 'workPhone': 
					newProspect.work = input;	
					break;
				case 'address': 
					newProspect.address = input;	
					break;
				case 'city': 
					newProspect.city = input;	
					break;
				case 'state': 
					newProspect.state = input;	
					break;
				case 'zip': 
					newProspect.zip = input;
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
					$('#dynamicCard').toggleClass('hide');
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

});
