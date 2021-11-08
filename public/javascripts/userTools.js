function clickHandler(val) {

	var xhr = new XMLHttpRequest();


	switch (val) {
		case 1: // add
			var formData = new FormData(document.getElementById("toAdd"));
			console.log(formData);
			var object = {};
			formData.forEach(function (value, key) {
				object[key] = value;
				console.log(object);
			});
			var json = JSON.stringify(object);

			xhr.open('POST', '/data', true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					alert('added');
				}
			};
			xhr.send(json);
			break;

			break;
		case 2: // view all
			xhr.open('GET', '/data', true);
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					document.getElementById('data').innerHTML = this.responseText;
				}
			};
			xhr.send();
			break;

		case 3: // delete
			if (confirm('Are you sure?')) {
				xhr.open('DELETE', '/data/' + document.getElementById("idToEdit").innerHTML, true);
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						eraseEditVals();
						alert('deleted');
					}
				};
				xhr.send();
			}
			break;

		case 4: // seek
			setEditValsFromSeek();
			break;

		case 5: 
			var formData = new FormData(document.getElementById("toEdit"));
			console.log(formData);
			var object = {};
			formData.forEach(function (value, key) {
				object[key] = value;
				console.log(object);
			});
			var json = JSON.stringify(object);
			

			xhr.open('PATCH', '/data/' + document.getElementById("idToEdit").innerHTML, true);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					alert('updated');
				}
			};
			xhr.send(json);
			break;
		default:
			alert("error");
			break;
	}
}

function setEditValsFromSeek() {
	var xhr = new XMLHttpRequest();
	indexToRequest = document.getElementById("toSeek").elements['id'].value;
	eraseEditVals();
	document.getElementById("idToEdit").innerHTML = indexToRequest;

	f = document.getElementById("toEdit");

	xhr.open('GET', '/data/' + new String(indexToRequest), true);
	xhr.onreadystatechange = function () {
		console.log(this.responseText);
		if (this.readyState == 4 && this.status == 200) {
			res = this.responseText.split(',')
			f = document.getElementById("toEdit");
			f.elements['station'].value = res[0];
			f.elements['year'].value = res[1];
			f.elements['month'].value = res[2];
			f.elements['day'].value = res[3];
			f.elements['temp'].value = res[4];
		}
		else if (this.readyState == 4) {
			alert("not found");
			eraseEditVals();
        }
	};
	xhr.send();
}

function eraseEditVals() {
	document.getElementById("toEdit").reset();
}

function wrapForm(f) {
	var res = f.elements['station'].value + ',' +
		f.elements['year'].value + ',' +
		f.elements['month'].value + ',' +
		f.elements['day'].value + ',' +
		f.elements['temp'].value;
	console.log(res);
	return res;
}