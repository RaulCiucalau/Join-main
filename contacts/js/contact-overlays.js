function closeOverlay() {
  const addOverlay = document.getElementById('outer-add-contact-overlay');
  const editOverlay = document.getElementById('outer-edit-contact-overlay');
  if (addOverlay) {
    addOverlay.remove();
  }
  if (editOverlay) {
    editOverlay.remove();
  }
}
document.body.addEventListener("click", function (e) {
  if (e.target && e.target.id === "create-contact") {
    e.preventDefault();
    getOverlayData();
  }
});

function getOverlayData() {
  const { errorBox, nameError, emailError, phoneError, name, email, phone } = constNameEmailPhoneInputOverlay();
  emptyNameError();
  let valid = true;
  if (!name) {
    enterName();
  } else if (/\d/.test(name)) {
    nameWithoutContain();
  }
  if (!email) {
    enterEmail();
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    validEmailAdress();
  }
  if (!phone) {
    enterPhoneNumber();
  } else if (!/^\d+$/.test(phone)) {
    checkOnlyDigits();
  }
  if (!valid) {
    return errorBoxHide2();
  }
  addNewContactToDatabase(name, email, phone);

  function enterName() {
    nameError.innerText = "Please enter a name";
    valid = false;
  }

  function nameWithoutContain() {
    nameError.innerText = "Name must not contain numbers";
    valid = false;
  }

  function enterEmail() {
    emailError.innerText = "Please enter an email";
    valid = false;
  }

  function validEmailAdress() {
    emailError.innerText = "Invalid email address";
    valid = false;
  }

  function enterPhoneNumber() {
    phoneError.innerText = "Please enter a phone number";
    valid = false;
  }

  function checkOnlyDigits() {
    phoneError.innerText = "Phone number must contain only digits";
    valid = false;
  }

  function errorBoxHide2() {
    errorBox.classList.remove("hide2");
    return;
  }

  function emptyNameError() {
    errorBox.classList.add("hide2");
    nameError.innerText = "";
    emailError.innerText = "";
    phoneError.innerText = "";
  }

  function constNameEmailPhoneInputOverlay() {
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
    return { errorBox, nameError, emailError, phoneError, name, email, phone };
  }
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
