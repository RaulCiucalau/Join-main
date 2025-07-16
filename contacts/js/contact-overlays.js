function closeOverlay()
{
    let overlay = document.getElementById('outer-add-contact-overlay');
    overlay.remove(); 
}

document.body.addEventListener("click", function (e) {
  if (e.target && e.target.id === "create-contact") {
    e.preventDefault();
    getOverlayData();
  }
});


function getOverlayData() {
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("new-email");
  const phoneInput = document.getElementById("new-phone");
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const errorBox = document.getElementById("form-error-msg");
  const nameError = nameInput.closest(".input-group").querySelector(".error-message");
  const emailError = emailInput.closest(".input-group").querySelector(".error-message");
  const phoneError = phoneInput.closest(".input-group").querySelector(".error-message");
  errorBox.classList.add("hide2");
  nameError.innerText = "";
  emailError.innerText = "";
  phoneError.innerText = "";
  let valid = true;
  if (!name) {
    nameError.innerText = "Please enter a name";
    valid = false;
  } else if (/\d/.test(name)) {
    nameError.innerText = "Name must not contain numbers";
    valid = false;
  }
  if (!email) {
    emailError.innerText = "Please enter an email";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.innerText = "Invalid email address";
    valid = false;
  }
  if (!phone) {
    phoneError.innerText = "Please enter a phone number";
    valid = false;
  } else if (!/^\d+$/.test(phone)) {
    phoneError.innerText = "Phone number must contain only digits";
    valid = false;
  }
  if (!valid) {
    errorBox.classList.remove("hide2");
    return;
  }
  addNewContactToDatabase(name, email, phone);
}



function contactsuccessfullyDeletedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully deleted.</div>`;
  if (window.innerWidth < 1250) {
    setTimeout(function () {
      window.location.reload();
    }, 2000);
  }
}
