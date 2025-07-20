/**
 * Retrieves and trims the values from name, email, and phone input fields.
 * @returns {object} - An object containing trimmed `name`, `email`, and `phone` strings.
 */
function constNameEmailPhoneTrim() {
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("new-email").value.trim();
  const phone = document.getElementById("new-phone").value.trim();
  return { name, email, phone };
}

/**
 * Validates the name, email, and phone inputs using validation functions.
 * @returns {object} - An object containing boolean validation results: `nameValid`, `emailValid`, and `phoneValid`.
 */
function constNameEmailPhone() {
  const nameValid = isNameValid("fullName");
  const emailValid = isEmailValid("new-email");
  const phoneValid = isPhoneValid("new-phone");
  return { nameValid, emailValid, phoneValid };
}

/**
 * Saves an edited contact to the database after validation.
 * @param {string} key - Firebase key.
 * @returns {Promise<void>}
 */
async function saveEditedContact(key) {
  const { nameValid, emailValid, phoneValid } = constNameEmailPhone();
  if (!nameValid || !emailValid || !phoneValid) return;
  const { name, email, phone } = constNameEmailPhoneTrim();
  try {
    await fetch(getUserUrl(key), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, e_mail: email, phone }),
    });
    closeEditOverlay();
    contactFirebase();
    renderRightContactArea(name, email, phone, key, users);
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

/**
 * Retrieves and trims the values from name, email, and phone input fields.
 * @returns {object} - An object containing trimmed `name`, `email`, and `phone` strings.
 */
function constNameEmailPhoneTrim() {
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("new-email").value.trim();
  const phone = document.getElementById("new-phone").value.trim();
  return { name, email, phone };
}


/**
 * Validates the name, email, and phone inputs using validation functions.
 * @returns {object} - An object containing boolean validation results: `nameValid`, `emailValid`, and `phoneValid`.
 */
function constNameEmailPhone() {
  const nameValid = isNameValid("fullName");
  const emailValid = isEmailValid("new-email");
  const phoneValid = isPhoneValid("new-phone");
  return { nameValid, emailValid, phoneValid };
}


/**
 * Adds a new contact to the database after validation.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 */
async function addNewContactToDatabase(name, email, phone) {
  const inputs = getInputElements();
  const errors = getErrorElements(inputs.nameInput, inputs.emailInput, inputs.phoneInput);
  const trimmed = trimInputs({ name, email, phone });
  clearErrorMessages(errors.nameError, errors.emailError, errors.phoneError);
  if (!validateInputs(trimmed, errors)) return;
  const avatarData = generateAvatarAndColor(trimmed.name);
  const newContact = createNewContactObject(
    trimmed.name,
    email,
    phone,
    avatarData.randomColor,
    avatarData.initials
  );
  await sendContactToServer(newContact);
}

/**
 * Trims whitespace from inputs.
 * @param {object} inputs - { name, email, phone }
 * @returns {object} - Trimmed inputs.
 */
function trimInputs({ name, email, phone }) {
  return {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
  };
}

/**
 * Validates inputs and sets error messages.
 * @param {object} inputs - { name, email, phone }
 * @param {object} errors - { nameError, emailError, phoneError }
 * @returns {boolean} - True if all inputs valid.
 */
function validateInputs({ name, email, phone }, { nameError, emailError, phoneError }) {
  let valid = true;
  if (/\d/.test(name)) {
    setNameError(nameError);
    valid = false;
  }
  if (!isValidEmail(email)) {
    setEmailError(emailError);
    valid = false;
  }
  if (!/^\d+$/.test(phone)) {
    setPhoneError(phoneError);
    valid = false;
  }
  return valid;
}

/**
 * Sends new contact to server and handles UI updates.
 * @param {object} newContact
 */
async function sendContactToServer(newContact) {
  try {
    await fetch(getUserUrl(), createFetchOptions(newContact));
    closeAddContactOverlay();
    contactFirebase();
  } catch (error) {
    console.error("Fehler beim Speichern in Firebase:", error);
  }
}


/**
 * Gets the input elements for name, email, and phone.
 * @returns {object} - Object with nameInput, emailInput, phoneInput DOM elements.
 */
function getInputElements() {
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("new-email");
  const phoneInput = document.getElementById("new-phone");
  return { nameInput, emailInput, phoneInput };
}

/**
 * Gets the error message elements associated with the inputs.
 * @param {HTMLElement} nameInput
 * @param {HTMLElement} emailInput
 * @param {HTMLElement} phoneInput
 * @returns {object} - Object with nameError, emailError, phoneError DOM elements.
 */
function getErrorElements(nameInput, emailInput, phoneInput) {
  const nameError = nameInput.closest(".input-group")?.querySelector(".error-message");
  const emailError = emailInput.closest(".input-group")?.querySelector(".error-message");
  const phoneError = phoneInput.closest(".input-group")?.querySelector(".error-message");
  return { nameError, emailError, phoneError };
}

/**
 * Clears the error messages from all input fields.
 * @param {HTMLElement} nameError
 * @param {HTMLElement} emailError
 * @param {HTMLElement} phoneError
 */
function clearErrorMessages(nameError, emailError, phoneError) {
  nameError.innerText = "";
  emailError.innerText = "";
  phoneError.innerText = "";
}

/**
 * Sets the name error message for invalid names.
 * @param {HTMLElement} nameError
 */
function setNameError(nameError) {
  nameError.innerText = "Name must not contain numbers";
}

/**
 * Sets the email error message for invalid emails.
 * @param {HTMLElement} emailError
 */
function setEmailError(emailError) {
  emailError.innerText = "Invalid email address";
}

/**
 * Sets the phone error message for invalid phone numbers.
 * @param {HTMLElement} phoneError
 */
function setPhoneError(phoneError) {
  phoneError.innerText = "Phone number must contain digits only";
}

/**
 * Checks if the email address is valid.
 * @param {string} email
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generates a random color and initials for the avatar based on the name.
 * @param {string} name
 * @returns {object} - Object with randomColor and initials.
 */
function generateAvatarAndColor(name) {
  const randomColor = colours[Math.floor(Math.random() * colours.length)];
  const initials = name
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');
  return { randomColor, initials };
}

/**
 * Creates the new contact object with all properties.
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @param {string} color
 * @param {string} initials
 * @returns {object} - The new contact object.
 */
/**
 * Creates the new contact object with all required properties for Firebase.
 * @param {string} name - Contact's name.
 * @param {string} email - Contact's email.
 * @param {string} phone - Contact's phone number.
 * @param {string} color - Avatar background color.
 * @param {string} initials - Avatar initials.
 * @returns {object} - The new contact object.
 */
function createNewContactObject(name, email, phone, color, initials) {
  return {
    name: name,
    e_mail: email,
    phone: phone,
    color: color,
    avatar: initials
  };
}

/**
 * Creates the options object for the fetch request.
 * @param {object} newContact - Contact object to send.
 * @returns {object} - Fetch options with method, headers, and body.
 */
function createFetchOptions(newContact) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newContact),
  };
}


/**
 * Closes the contact details list overlay.
 */
function closeContactList() {
  const detailContainer = document.getElementById("contact-details");
  if (detailContainer) {
    detailContainer.classList.add("dp-none");
  }
}
document.addEventListener('DOMContentLoaded', () => {
  init();
});

/**
 * Closes the edit contact overlay.
 */
function closeEditOverlay() {
  let container = document.getElementById('outer-edit-contact-overlay');
  container.classList.add('display-none-overlay');
}

/**
 * Closes the add contact overlay.
 */
function closeAddContactOverlay() {
  let container = document.getElementById('outer-add-contact-overlay');
  container.classList.add('display-none-overlay');
}

