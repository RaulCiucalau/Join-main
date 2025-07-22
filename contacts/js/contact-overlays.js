/**
 * Closes (removes) the contact overlay from the DOM.
 *
 * This function checks for both 'add' and 'edit' contact overlays and removes them if they exist.
 */
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

/**
 * Handles overlay form data collection, validation, and submission.
 */
function getOverlayData() {
  const { nameInput, emailInput, phoneInput, errorBox, nameError, emailError, phoneError } = getOverlayElements();
  resetOverlayErrors(errorBox, nameError, emailError, phoneError);
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  let valid = validateOverlayName(name, nameError);
  valid = validateOverlayEmail(email, emailError) && valid;
  valid = validateOverlayPhone(phone, phoneError) && valid;
  if (!valid) {
    errorBox.classList.remove("hide2");
    return;
  }
  addNewContactToDatabase(name, email, phone);
}

/**
 * Gets all relevant DOM elements for the overlay form.
 */
function getOverlayElements() {
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("new-email");
  const phoneInput = document.getElementById("new-phone");
  const errorBox = document.getElementById("form-error-msg");
  const nameError = nameInput.closest(".input-group").querySelector(".error-message");
  const emailError = emailInput.closest(".input-group").querySelector(".error-message");
  const phoneError = phoneInput.closest(".input-group").querySelector(".error-message");
  return { nameInput, emailInput, phoneInput, errorBox, nameError, emailError, phoneError };
}

/**
 * Resets error messages and hides the error box for the overlay form.
 */
function resetOverlayErrors(errorBox, nameError, emailError, phoneError) {
  errorBox.classList.add("hide2");
  nameError.innerText = "";
  emailError.innerText = "";
  phoneError.innerText = "";
}

/**
 * Validates the name field for the overlay form.
 */
function validateOverlayName(name, nameError) {
  if (!name) {
    nameError.innerText = "Please enter a name";
    return false;
  } else if (/\d/.test(name)) {
    nameError.innerText = "Name must not contain numbers";
    return false;
  }
  return true;
}

/**
 * Validates the email field for the overlay form.
 */
function validateOverlayEmail(email, emailError) {
  if (!email) {
    emailError.innerText = "Please enter an email address";
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.innerText = "Invalid email address";
    return false;
  }
  return true;
}

/**
 * Validates the phone field for the overlay form.
 */
function validateOverlayPhone(phone, phoneError) {
  if (!phone) {
    phoneError.innerText = "Please enter a phone number";
    return false;
  } else if (!/^\d+$/.test(phone)) {
    phoneError.innerText = "Phone number must contain digits only";
    return false;
  }
  return true;
}

function contactsuccessfullyDeletedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = getContactDeletedNotificationHtml();
  if (window.innerWidth < 1250) {
    setTimeout(function () {
      window.location.reload();
    }, 2000);
  }
}
