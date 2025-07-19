/**
 * Clears the task form inputs.
 */
function clearTaskForm() {
  subtasks = [];
  clearInputs();
  unselectPrio("urgent");
  unselectPrio("low");
  selectedContacts = [];
  selectedContactsNames = [];
  removeFieldRequired();
}

/**
 * Clears all input fields.
 */
function clearInputs() {
  document.getElementById("subtask-list").innerHTML = "";
  document.getElementById("subtask").value = "";
  document.getElementById("add-task-title").value = "";
  document.getElementById("add-task-due-date").value = "";
  document.getElementById("add-task-description").value = "";
  document.getElementById("selected-avatars").innerHTML = "";
  document.getElementById("category").value = "";
  document.getElementById("assigned-to").value = "";
}

/**
 * Removes the required field indication.
 * @param {HTMLElement} element - The element to update.
 */
function removeFieldRequired() {
  document.getElementById("required-title").classList.add("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid #d1d1d1";
  document.getElementById("required-date").classList.add("dp-none");
  document.getElementById("add-task-due-date").style.border = "1px solid #d1d1d1";
  document.getElementById("required-category").classList.add("dp-none");
  document.getElementById("category").style.border = "1px solid #d1d1d1";
}
