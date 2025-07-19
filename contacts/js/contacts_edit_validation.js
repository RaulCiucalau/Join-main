/**
 * Validates the name input for presence and ensures it contains no numbers.
 * @param {string} inputId - The ID of the input element to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isNameValid(inputId) {
  const input = document.getElementById(inputId);
  const nameValue = input.value.trim();
  hideInputError(inputId);
  if (!nameValue || /\d/.test(nameValue)) {
    showInputError(inputId);
    return false;
  }
  return true;
}

/**
 * Validates the email input for presence and correct email format.
 * @param {string} inputId - The ID of the input element to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isEmailValid(inputId) {
  const input = document.getElementById(inputId);
  const emailValue = input.value.trim();
  hideInputError(inputId);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValue || !emailPattern.test(emailValue)) {
    showInputError(inputId);
    return false;
  }
  return true;
}

/**
 * Validates the phone input for presence and ensures it contains only digits.
 * @param {string} inputId - The ID of the input element to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isPhoneValid(inputId) {
  const input = document.getElementById(inputId);
  const phoneValue = input.value.trim();
  hideInputError(inputId);
  if (!phoneValue || !/^\d+$/.test(phoneValue)) {
    showInputError(inputId);
    return false;
  }
  return true;
}

/**
 * Shows the error message for the given input by removing the 'hidden' class.
 * @param {string} inputId - The ID of the input element.
 */
function showInputError(inputId) {
  const input = document.getElementById(inputId);
  const errorElement = input.closest('.input-group').querySelector('.error-message');
  if (errorElement) {
    errorElement.style.display = 'block';
  }
}

/**
 * Hides the error message for the given input by adding the 'hidden' class.
 * @param {string} inputId - The ID of the input element.
 */
function hideInputError(inputId) {
  const input = document.getElementById(inputId);
  const errorElement = input.closest('.input-group').querySelector('.error-message');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

/**
 * Shows the error message element associated with the given input ID.
 *
 * @param {string} inputId - The ID of the input element whose error message to show.
 */
function showInputError(inputId) {
  const errorElement = document.getElementById(`${inputId}-error`);
  if (errorElement) errorElement.classList.remove("hidden");
}

/**
 * Hides the error message element associated with the given input ID.
 *
 * @param {string} inputId - The ID of the input element whose error message to hide.
 */
function hideInputError(inputId) {
  const errorElement = document.getElementById(`${inputId}-error`);
  if (errorElement) errorElement.classList.add("hidden");
}