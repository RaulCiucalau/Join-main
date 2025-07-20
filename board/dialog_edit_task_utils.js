/**
 * Validates if the due date in the input field is within acceptable range.
 * Shows an error if the date is in the past or exceeds the year 2130.
 *
 * @param {string} inputId - The ID of the input element containing the date.
 * @returns {boolean} True if the date is valid, false otherwise.
 */
function isDueDateValid(inputId) {
    const { errorMessageId, input, today } = getDueDateValidationElements(inputId);
    let existingError = document.getElementById(errorMessageId);
    if (existingError) existingError.remove();
    const inputYear = getInputYear(input);
    if (input.value < today) {
        showDateError(input, errorMessageId, "Date cannot be in the past");
        return false;
    }
    if (inputYear > 2130) {
        showDateError(input, errorMessageId, "The selected date exceeds the maximum allowed year (2130)");
        return false;
    }
    return true;
}

/**
 * Gets the input element, error message ID, and today's date for due date validation.
 * @param {string} inputId - The ID of the input element.
 * @returns {{errorMessageId: string, input: HTMLInputElement, today: string}}
 */
function getDueDateValidationElements(inputId) {
    const input = document.getElementById(inputId);
    const errorMessageId = `${inputId}-error`;
    const today = new Date().toISOString().split("T")[0];
    return { errorMessageId, input, today };
}

/**
 * Gets the year from the input's value as a number.
 * @param {HTMLInputElement} input - The input element containing the date value.
 * @returns {number} The year from the input value.
 */
function getInputYear(input) {
    const inputDate = new Date(input.value);
    return inputDate.getFullYear();
}

/**
 * Displays a styled error message below an input element.
 *
 * @param {HTMLInputElement} input - The input element where the error occurred.
 * @param {string} errorMessageId - The ID to assign to the error message element.
 * @param {string} message - The error message text to display.
 */
function showDateError(input, errorMessageId, message) {
    const errorText = document.createElement("p");
    errorText.id = errorMessageId;
    errorText.textContent = `${message}`;
    errorText.style.color = "red";
    errorText.style.fontSize = "0.85rem";
    errorText.style.marginTop = "4px";
    input.insertAdjacentElement("afterend", errorText);
}

/**
 * Validates if the input field contains a non-empty title.
 * Shows an error message if the field is empty or contains only whitespace.
 *
 * @param {string} inputId - The ID of the input element to validate.
 * @returns {boolean} True if the title is valid, false otherwise.
 */
function isTitleValid(inputId) {
    const input = document.getElementById(inputId);
    const errorMessageId = `${inputId}-error`;
    let existingError = document.getElementById(errorMessageId);
    if (existingError) existingError.remove();
    if (!input.value.trim()) {
        const errorText = document.createElement("p");
        errorText.id = errorMessageId;
        errorTextForm(errorText);
        input.insertAdjacentElement("afterend", errorText);
        return false;
    }
    return true;
}

/**
 * Styles and sets the error message for required title fields.
 * @param {HTMLElement} errorText - The error message element.
 */
function errorTextForm(errorText) {
    errorText.textContent = "This field is required";
    errorText.style.color = "red";
    errorText.style.fontSize = "0.85rem";
    errorText.style.marginTop = "4px";
}