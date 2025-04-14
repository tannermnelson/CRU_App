function handleDownloadTypeChange() {
     let downloadType = document.getElementById("download_type").value;
     let inspectionInput = document.getElementById("inspection_number");
 
     if (downloadType === "Training Download") {
         let randomNumber = Math.floor(100000 + Math.random() * 900000);
         inspectionInput.value = randomNumber;
         inspectionInput.readOnly = true;
     } else {
         inspectionInput.value = "";
         inspectionInput.readOnly = false;
     }
 }
 


document.addEventListener('DOMContentLoaded', function() {

	const updateSection = document.getElementById('updateRecord');
    updateSection.style.display = 'none';

	//Create and add spinner to the page
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    spinner.style.display = 'none';
    spinner.style.position = 'fixed';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    spinner.style.transform = 'translate(-50%, -50%)';
    spinner.style.border = '8px solid #f3f3f3';
    spinner.style.borderTop = '8px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '60px';
    spinner.style.height = '60px';
    spinner.style.animation = 'spin 1s linear infinite';
    document.body.appendChild(spinner);

    // Spinner animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);


	// JavaScript to toggle the visibility of the Update Existing Record section
	document.getElementById('toggleUpdateRecord').addEventListener('click', function () {
		//const updateSection = document.getElementById('updateRecord');
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

		if (!inspection_number) {
			alert('Please select an Inspection Number and Email Used for Initial Submission.');
			return; // Exit early if inputs are invalid
		}

		spinner.style.display = 'block'; //show spinner
		
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
					document.getElementById('email').value = data.email;
					document.getElementById('troop').value = data.troop;
					document.getElementById('engine_make').value = data.engine_make;
					document.getElementById('engine_model').value = data.engine_model;
					document.getElementById('engine_year').value = data.engine_year;	
					document.getElementById('inspection_number').value = data.inspection_number;
					document.getElementById('dmv349_report_number').value = data.dmv349_report_number;	
					document.getElementById('post_crash_trailer_used').value = data.post_crash_trailer_used;	
					document.getElementById('warrant').value = data.warrant;	
					document.getElementById('unit_type').value = data.unit_type;	
					document.getElementById('notes').value = data.notes;	
					document.getElementById('download_type').value = data.download_type;	
					document.getElementById('district').value = data.district;
					document.getElementById('date').value = data.date;
					document.getElementById('time').value = data.time;


					const equipment = data.equipment; // Assume this is an array
					const equipmentSelect = document.getElementById('equipment_used');
					Array.from(equipmentSelect.options).forEach(option => {
						option.selected = equipment.includes(option.value);
					});

					const software = data.software; // Assume this is an array
					const softwareSelect = document.getElementById('software_used');
					Array.from(softwareSelect.options).forEach(option => {
						option.selected = software.includes(option.value);
					});

					//console.log('other_violations:', data.other_violations);
					
					alert('Record found for the provided Inspection Number and Email.');
				} else {
					alert('No record found for the provided Inspection number and email.');
				}
			})
			.catch(error => console.error('Error fetching record:', error))

			.finally(() => spinner.style.display = 'none'); //hide spinner

	});

	// Handle posting record
	document.getElementById('userForm').addEventListener('submit', function(event) {
		event.preventDefault();
		
		const operator = document.getElementById('operator').value;
		const technician = document.getElementById('technician').value;
		const email = document.getElementById('email').value;
		const troop = document.getElementById('troop').value;
		const district = document.getElementById('district').value;
		const date = document.getElementById('date').value;
		const time = document.getElementById('time').value;
		const inspection_number = document.getElementById('inspection_number').value;
		const dmv349_report_number = document.getElementById('dmv349_report_number').value;
		const equipment = Array.from(document.getElementById('equipment_used').selectedOptions).map(opt => opt.value);
		const software = Array.from(document.getElementById('software_used').selectedOptions).map(opt => opt.value);
		const warrant = document.getElementById('warrant').value;
		const unit_type = document.getElementById('unit_type').value;
		const download_type = document.getElementById('download_type').value;
		const notes = document.getElementById('notes').value;
		const post_crash_trailer_used = document.getElementById('post_crash_trailer_used').value;
		const engine_make = document.getElementById('engine_make').value;
		const engine_model = document.getElementById('engine_model').value;
		const engine_year = document.getElementById('engine_year').value;




		//Validate the form fields
		if (!operator || !technician || !email || !troop || !date || !time || !district || !inspection_number || !dmv349_report_number || !equipment || !software || !engine_make || !engine_model || !engine_year || !warrant || !unit_type || !download_type || !notes || !post_crash_trailer_used) {
			alert('Please fill in all required fields.');
		 	return; // Exit if any field is empty
		 }

		// Validate email format with Regular Expression (Regex)
		 const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		 if (!emailPattern.test(email)) {
		 	alert('Please enter a valid email address.');
		 	return; // Exit if email format is invalid
		 }
		
		 // Validate inspection number format
		 if (!/^\d{7}$/.test(inspection_number)) {
		 	alert('The Inspection Number field must be exactly 7 digits.');
		 	return; // Exit if validation fails
		 }

		 // Validate dmv number
		 //if (!/^\d{7}[A-Z]{2}$/.test(dmv349_report_number)) {
		 	//alert('The DMV Report Number must be formatted properly.')
		 	//return; // Exit if validation fails
		 }
		
		// Prepare the form data for submission
		const formData = {
			operator,
			technician,
			email,
			troop,
			district,
			date,
			time,
			inspection_number,
			dmv349_report_number,
			equipment,
			software,
			engine_make,
			engine_model,
			engine_year,
			post_crash_trailer_used,
			unit_type,
			download_type,
			warrant,
			notes
		};

		spinner.style.display = 'block'; //show spinner
		
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

			// Refresh the page after submission
			window.location.reload();
		})
		.catch(error => {
			alert('There was a problem with your submission.');
			console.error('Error:', error);
		})

		.finally(() => spinner.style.display = 'none'); // hide spinner

	});
});

// Set default date and time
window.onload = function() {
	const today = new Date();
	document.getElementById('date').value = today.toISOString().split('T')[0];
	document.getElementById('time').value = today.toTimeString().split(' ')[0].slice(0, 5);
};
