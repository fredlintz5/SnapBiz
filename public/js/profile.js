
let userId = location.href.split('/');
let userVerify = userId[userId.length - 1]


if (!sessionStorage.verify || sessionStorage.user !== userVerify) {
	window.location = '/';
} 


$(document).ready(function() {
	
});
