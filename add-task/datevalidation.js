document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('add-task-due-date');
  const today = new Date().toISOString().split('T')[0]; // z. B. "2025-05-26"
  dateInput.setAttribute('min', today);
});

function isDateInFuture(dateString) {
  const today = new Date();
  const selectedDate = new Date(dateString);

  // Setze beide auf 00:00 Uhr, um Zeitunterschiede zu vermeiden
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate >= today;
}

const dueDate = document.getElementById('add-task-due-date').value;

if (!isDateInFuture(dueDate)) {
  alert("The due date must not be in the past.");
  return;
}
