
function getProspectData(userID, prospectID) {
	$.ajax({
		url: `/api/${userID}/${prospectID}`,
		type: 'GET'
	})
	.done(function(result) {
		console.log(result[0]);
		let newRow = 
			`<tr>
				<td>${result[0].id}</td>
		        <td>${result[0].firstName}</td>
		        <td>${result[0].lastName}</td>
	            <td>${result[0].title}</td>
	            <td>${result[0].company}</td>
	            <td>${result[0].email}</td>
	            <td>${result[0].mobile}</td>
	            <td>${result[0].work}</td>
			</tr>`;
		
		$('#tbody2').append(newRow);
	});
}


$(document).ready(()=> {

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
					// this function lives in profile.js
					getTableData();
				} else {
					alert('Incorrect Id submitted, try again');
				}
			})
		}
	});


	$('#upButt').on('click', function() {
			$('#input-group2').toggleClass('hide');
			$('#upButt').toggleClass('hide');
		});


	$('#cancelUpdate').on('click', function() {
		$('#input-group2').toggleClass('hide');
		$('#upButt').toggleClass('hide');
	});


	$('#confirmUpdate').on('click', function() {
		let ProspectId = parseInt($('#updateProspect').val().trim());
		let UserId = sessionStorage.user;

		if (ProspectId != ProspectId) {
			$('#updateProspect').css('border-color', 'red');
			$('#updateProspect').val('');
			$('#updateProspect').attr('placeholder', 'Please only use Integers');
		} else {
			
			$('#updateModal').modal('toggle');
			$('#tbody2').empty();

			getProspectData(UserId, ProspectId);
		
			$('#reallyConfirmUpdate').on('click', function() {
				let option = $('#updateOptions').val();
				let input = $('#updateInput').val();
				let newProspect = {};

				if (option === 'null') {
					$('#updateOptions').css('border-color', 'red');

					$('#updateOptions').on('change', function() {
						$('#updateOptions').css('border-color', 'grey');
						option = $('#updateOptions').val();
					})
				} else if (input === '') {
					$('#updateInput').css('border-color', 'red');
					$('#updateInput').attr('placeholder', 'Please Input update value here');

					$('#updateInput').on('change', function() {
						$('#updateInput').css('border-color', 'grey');
						input = $('#updateInput').val();
					})
				}

				switch (option) {
					case 'firstName': 
						newProspect.firstName = input;
						break;
					case 'lastName': 
						newProspect.lastName = input;
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

				$.ajax({
					url: `/user/${ProspectId}/updateProspect`,
					type: 'PUT',
					data: newProspect,
				})
				.done(function(result) {
					$('#tbody2').empty();
					$('#updateOptions').val('null');
					$('#updateInput').val("");
					$('#updateModal').modal('toggle');
					$('#tbody').empty();
					$('#updateProspect').val('');
					$('#input-group2').toggleClass('hide');
					$('#upButt').toggleClass('hide');
					getTableData();
				})
			})
		}
	});

});

