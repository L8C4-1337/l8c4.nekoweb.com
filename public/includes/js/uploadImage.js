
function appendTextToFile(text) {
	fetch('https://424241.xyz/appendLink.php', {
		method: 'POST',
		body: new URLSearchParams({
			'text': text
		})
	})
	.then(response => response.json())
	.then(data => {
		//console.log(data.message);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

//appendTextToFile("https://files.catbox.moe/lu3j3f.jpg");

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const progressFill = document.getElementById("progressFill");
const filePathDisplay = document.getElementById("filePathDisplay");
const uploadButton = document.getElementById("uploadButton");
var fileCondition = false;
var percent = 0;
const clickableText = document.getElementById("clickableText");

const validTypes = ['image/png', 'image/jpeg', 'image/webp'];

clickableText.addEventListener("click", function(event) {
	event.stopPropagation();
});

filePathDisplay.addEventListener("click", function(event) {
	event.stopPropagation();
});


dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (e) => {
	e.preventDefault();
	dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
	dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
	fileCondition = false;
	e.preventDefault();
	dropArea.classList.remove("dragover");
	handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change", () => {
	fileCondition = false
	handleFile(fileInput.files[0]);
});

function handleFile(file) {
	if (!validTypes.includes(file.type)) {
		alert("Only PNG, JPG, JPEG, or WEBP files are allowed.");
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		preview.innerHTML = `<img src="${e.target.result}" alt="Preview"/>`;
	};
	reader.readAsDataURL(file);

	fileCondition = true;
	fileToUpload = file;
}
const RATE_LIMIT_MINUTES = 30;
const LAST_UPLOAD_KEY = "lastUploadTime";
uploadButton.addEventListener("click", function() {
// Check client-side rate limit
	const lastUpload = localStorage.getItem(LAST_UPLOAD_KEY);
	if (lastUpload) {
const elapsed = (Date.now() - parseInt(lastUpload, 10)) / 60000; // minutes
if (elapsed < RATE_LIMIT_MINUTES) {
	alert(`You can upload again in ${Math.ceil(RATE_LIMIT_MINUTES - elapsed)} minutes.`);
	return;
}
else if(fileCondition){
	uploadFile(fileToUpload);
}
}
else if (fileCondition) {
	uploadFile(fileToUpload);
// Here, you can proceed with your upload logic, e.g., using FormData to send the file to a server
} else {
	console.log("No image selected!");
}
});

function uploadFile(file) {
	progressFill.style.width = "0%"
	percent = 0;
	const xhr = new XMLHttpRequest();

	const formData = new FormData();

	formData.append("reqtype", "fileupload");
formData.append("time", "72h"); // You can change to 12h, 24h, etc.
formData.append("file", file);
xhr.open("POST", "https://424241.xyz/litterbox-upload.php", true);

xhr.upload.addEventListener("progress", (e) => {
	if (e.lengthComputable) {
		percent = Math.round((e.loaded / e.total) * 100);
		progressFill.style.width = percent + "%";
	}
});

xhr.onload = function () {
	if (xhr.status === 200) {
		try {
			const response = JSON.parse(xhr.responseText);
			if (response.url && response.url.startsWith("https://")) {
				localStorage.setItem(LAST_UPLOAD_KEY, Date.now().toString());
				appendTextToFile(response.url);
				filePathDisplay.textContent = "File uploaded correctly! Remember that it first needs to be validated by me!";
				filePathDisplay.style.color = "#f2a2ff";
			} else {
				alert("Upload failed: " + xhr.responseText);
			}
		} catch (err) {
			alert("Upload failed: Invalid JSON response. Error: " + err);
		}
	} else {
		filePathDisplay.textContent = '';
		//alert("Upload failed with status: " + xhr.status);
		const response = JSON.parse(xhr.responseText);
		let message = "Upload failed.";

		if (xhr.status === 429) {
			message = "You can upload an image every 30 minutes.";
		} else if (xhr.status === 413) {
			message = "The file is too large. Max size is 10MB.";
		} else if (xhr.status === 415) {
			message = "Unsupported file type. Please upload PNG, JPG, or WEBP.";
		} else if (xhr.status === 400) {
			message = "Upload error: " + response.error;
		} else if (xhr.status === 500) {
			message = "Upload failed. Please try again later.";
		}

		alert(message);
	}
};

xhr.onerror = function () {
	alert("Network error during upload.");
};
xhr.send(formData);
}