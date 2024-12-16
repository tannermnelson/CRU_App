	document.addEventListener('DOMContentLoaded', function() {
	// Fetch both sites and troopers data
	fetch('https://hmrvhhu9r0.execute-api.us-east-2.amazonaws.com/getLists')
		.then(response => response.json())
		.then(data => {
			//console.log('Fetched data:', data);  // Debug: Check the fetched data
			
			// Handle engine make data
			const engine_makeSelect = document.getElementById('engine_make');
			if (data.engine && data.engine.length > 0) {
				data.engine_makes.forEach(engine_make => {
					const option = document.createElement('option');
					option.value = engine_make.engine_make; // Get the 'site' field
					option.textContent = engine_make.engine_make; // Display the site name
					engine_makeSelect.appendChild(option);
				});
			} else {
				console.error('No engine makes data available');
			}

			// Handle engine model data
			const engine_modelSelect = document.getElementById('engine_model');
			if (data.model && data.model.length > 0) {
				data.engine_models.forEach(engine_model => {
					const option = document.createElement('option');
					option.value = engine_model.engine_model; // Get the 'site' field
					option.textContent = engine_model.engine_model; // Display the site name
					engine_modelSelect.appendChild(option);
				});
			} else {
				console.error('No engine models data available');
			}

			const yearList = document.getElementById('engine_year');
			for (let year = 1990; year <= 2024; year++){
				const listItem = document.createElement('li');
				listItem.textContent = year;

				yearList.appendChild(listItem);
			}

			// Handle troopers data for both "Trooper" and "Operator" dropdowns
			const technicianSelects = document.querySelectorAll('technician'); // Select both dropdowns with id="trooper" and id="operator"
			if (data.techncian && data.technician.length > 0) {
				data.techncian.forEach(technician => {
					const option = document.createElement('option');
					option.value = technician.technician; // Get the 'trooper' field
					option.textContent = technician.technician; // Display the trooper name
					
					// Append the option to each select dropdown
					technicainSelects.forEach(select => {
						select.appendChild(option.cloneNode(true)); // Clone option for each dropdown
					});
				});
			} else {
				console.error('No technician data available');
			}

			const operatorSelects = document.querySelectorAll('operator'); // Select both dropdowns with id="trooper" and id="operator"
			if (data.operator && data.operator.length > 0) {
				data.operator.forEach(operator => {
					const option = document.createElement('option');
					option.value = operator.operator; // Get the 'trooper' field
					option.textContent = operator.operator; // Display the trooper name
					
					// Append the option to each select dropdown
					operatorSelects.forEach(select => {
						select.appendChild(option.cloneNode(true)); // Clone option for each dropdown
					});
				});
			} else {
				console.error('No operator data available');
			}


		})
		.catch(error => {
			console.error('Error fetching data:', error);
			const engineSelect = document.getElementById('engine_make');
			engineSelect.innerHTML = '<option>Error loading engine makes</option>';

			const modelSelect = document.getElementById('model_make');
			modelSelect.innerHTML = '<option>Error loading model makes</option>';

			const operatorSelect = document.getElementById('operator');
			operatorSelect.innerHTML = '<option>Error loading operators</option>';

			const technicianSelects = document.querySelectorAll('technician'); // Select both dropdowns
			technicianSelects.forEach(select => {
				select.innerHTML = '<option>Error loading technicians</option>';
			});
		});
	});

// JavaScript to toggle the visibility of the Update Existing Record section
document.getElementById('toggleUpdateRecord').addEventListener('click', function () {
	const updateSection = document.getElementById('updateRecord');
	if (updateSection.style.display === 'none') {
	    updateSection.style.display = 'block';
	} else {
	    updateSection.style.display = 'none';
	}
});

// Handle fetching existing record for update
document.getElementById('fetchRecord').addEventListener('click', function() {

	const inspection_number = document.getElementById('updateInspectionNumber').value;
	const email = document.getElementById('updateEmail').value;

	if (!inspection_number || !email) {
		alert('Please select an Inspection Number and Email Used for Initial Submission.');
		return; // Exit early if inputs are invalid
	}
	
	// Fetch the existing record from the database
	fetch(`https://hmrvhhu9r0.execute-api.us-east-2.amazonaws.com/getRecord?inspection_number=${inspection_number}&email=${encodeURIComponent(email)}`)
		.then(response => {
			if (response.status === 404) {
				// Handle 404 specifically
				alert('No record found for the provided Inspection Number and Email.');
				throw new Error('Record not found.');
			} else if (!response.ok) {
				// Handle other non-OK responses
				throw new Error('Failed to fetch record. Status code: ' + response.status);
			}
			return response.json();
		})
		
		.then(data => {
			if (data) {
				// Populate the form fields with the fetched data
				document.getElementById('operator').value = data.operator;
				document.getElementById('technician').value = data.technician;
				document.getElementById('e_mail').value = data.e_mail;
				document.getElementById('troop').value = data.troop;
				document.getElementById('engine_make').value = data.engine_make;
				document.getElementById('engine_model').value = data.engine_model;
				document.getElementById('engine_year').value = data.year;	
				document.getElementById('inspection_number').value = data.inspection_number;
				document.getElementById('dmv349_report_number').value = data.dmv349_report_number;	
				document.getElementById('post_crash_trailer_used').value = data.post_crash_trailer_used;	
				document.getElementById('warrant').value = data.warrant;	
				document.getElementById('unit_type').value = data.unit_type;	
				document.getElementById('notes').value = data.notes;	
				document.getElementById('download_type').value = data.download_type;	
				document.getElementById('district').value = data.district;	


				const equipment = data.equipment; // Assume this is an array
				const equipmentSelect = document.getElementById('equipment');
				Array.from(violationsSelect.options).forEach(option => {
					option.selected = violations.includes(option.value);
				});

				const violations = data.violations; // Assume this is an array
				const violationsSelect = document.getElementById('violations');
				Array.from(violationsSelect.options).forEach(option => {
					option.selected = violations.includes(option.value);
				});

				// Populate other violations if any
				document.getElementById('otherViolationsInput').value = data.other_violations || '';
				//console.log('other_violations:', data.other_violations);
				
				alert('Record found for the provided Inspection Number and Email.');
			} else {
				alert('No record found for the provided Inspection number and email.');
			}
		})
		.catch(error => console.error('Error fetching record:', error));

});

// Handle posting record
document.getElementById('userForm').addEventListener('submit', function(event) {
	event.preventDefault();
	
	const operator = document.getElementById('operator').value;
	const trooper = document.getElementById('trooper').value;
	const e_mail = document.getElementById('e_mail').value;
	const troop = document.getElementById('troop').value;
	const date = document.getElementById('date').value;
	const time = document.getElementById('time').value;
	const site = document.getElementById('site').value;
	const cve500 = document.getElementById('cve500').value;
	const citation = document.getElementById('citation').value.trim();
	const violations = Array.from(document.getElementById('violations').selectedOptions).map(opt => opt.value);
	const otherViolations = document.getElementById('otherViolationsInput').value; // Include other violations
	
	// Validate the form fields
	if (!operator || !trooper || !e_mail || !troop || !date || !time || !site || !cve500 || !citation || !violations) {
		alert('Please fill in all required fields.');
		return; // Exit if any field is empty
	}

	// Validate email format with Regular Expression (Regex)
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!emailPattern.test(e_mail)) {
		alert('Please enter a valid email address.');
		return; // Exit if email format is invalid
	}
	
	// Validate cve500 format
	if (!/^\d{7}$/.test(cve500)) {
		alert('The CVE500 field must be exactly 7 digits.');
		return; // Exit if validation fails
	}
	
	// Prepare the form data for submission
	const formData = {
		operator,
		trooper,
		e_mail,
		troop,
		date,
		time,
		site,
		cve500,
		citation,
		violations,
		otherViolations,
	};
	
	// Post the record to the database
	fetch('https://hmrvhhu9r0.execute-api.us-east-2.amazonaws.com/postRecord', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formData)
	})
	.then(response => {
		if (response.ok) return response.json();
		throw new Error('Network response was not ok.');
	})
	.then(data => {
		alert(data.message || 'Record created/updated successfully.');
		console.log('Response:', data);

		// Clear the form upon successful submission
		document.getElementById('userForm').reset();
		document.getElementById('otherViolation').style.display = 'none'; // Hide the other violations input

		// Refresh the page after submission
		window.location.reload();
	})
	.catch(error => {
		alert('There was a problem with your submission.');
		console.error('Error:', error);
	});
});

// Set default date and time
window.onload = function() {
	const today = new Date();
	document.getElementById('date').value = today.toISOString().split('T')[0];
	document.getElementById('time').value = today.toTimeString().split(' ')[0].slice(0, 5);
};