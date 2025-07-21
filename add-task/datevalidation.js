/**
 * Checks whether a given date is today or in the future.
 *
 * @param {string} dateString - A date string in the format "YYYY-MM-DD".
 * @returns {boolean} `true` if the date is today or in the future, otherwise `false`.
 */
function isDateInFuture(dateString) {
  const today = new Date();
  const selectedDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate >= today;
}

/**
 * Logs a warning if the due date is in the past.
 */
function handlePastDateWarning() {
  console.warn("Das ausgewählte Datum liegt in der Vergangenheit.");
}

/**
 * Logs a warning when no date input is found.
 */
function noDateInput() {
  console.warn('Kein Datum-Input (#add-task-due-date) gefunden.');
}

/**
 * Initializes references to the date input and submit button elements.
 *
 * @returns {{ dateInput: HTMLInputElement|null, submitBtn: HTMLButtonElement|null }}
 */
function getDateElements() {
  const dateInput = document.getElementById('add-task-due-date');
  const submitBtn = document.getElementById('submit-btn');
  return { dateInput, submitBtn };
}

/**
 * Sets the minimum selectable date of the date input field to today's date.
 *
 * @param {HTMLInputElement} dateInput - The date input element.
 */
function setMinDateToToday(dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

/**
 * Handles the submit button click event for validating the due date.
 *
 * @param {HTMLInputElement} dateInput - The date input element.
 */
function handleSubmit(dateInput) {
  const dueDate = dateInput.value;
  if (!isDateInFuture(dueDate)) {
    handlePastDateWarning();
    return;
  }
  console.log("Datum ist gültig:", dueDate);
}

/**
 * Initializes the date input validation logic after the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  const { dateInput, submitBtn } = getDateElements();

  if (!dateInput) {
    noDateInput();
    return;
  }

  setMinDateToToday(dateInput);

  if (submitBtn) {
    submitBtn.addEventListener('click', () => handleSubmit(dateInput));
  }
});
