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

document.addEventListener('DOMContentLoaded', () => {
  // Get relevant DOM elements
  /** @type {HTMLInputElement|null} */
  const dateInput = document.getElementById('add-task-due-date');
   /** @type {HTMLButtonElement|null} */
  const submitBtn = document.getElementById('submit-btn');

  if (!dateInput) {
    console.warn('Kein Datum-Input (#add-task-due-date) gefunden.');
    return;
  }
  
  
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const dueDate = dateInput.value;

      
      if (!isDateInFuture(dueDate)) {
        alert("The due date must not be in the past.");
        return; 
      }

      
      console.log("Datum ist gültig:", dueDate);
    });
  } else {
    
  }
});
