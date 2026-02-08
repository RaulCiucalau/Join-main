let selectedContacts = [];
let selectedContactsNames = [];

/**
 * Renders the list of contacts in the dropdown menu by generating and inserting
 * the HTML for each contact option. Highlights already selected contacts.
 */
function renderContactList() {
  document.getElementById("drop-down-contact-list").innerHTML += "";
  document.getElementById("drop-down-contact-list").innerHTML = "";
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    document.getElementById("drop-down-contact-list").innerHTML += contactListDropDownTemplate(indexContact);
    if (selectedContacts.includes(indexContact)) {
      selectContact(indexContact);
    }
  }
}

/**
 * Toggles the visibility of the contact dropdown list.
 * @param {Event} event - The event object to stop propagation.
 */
function showContactList(event) {
  event.stopPropagation();
  if (document.getElementById("assigned-to-img-up").classList.contains("dp-none")) {
    document.getElementById("assigned-to-img-up").classList.remove("dp-none");
    document.getElementById("assigned-to-img-down").classList.add("dp-none");
    document.getElementById("drop-down-contact-list").classList.remove("dp-none");
    renderContactList();
  } else {
    closeContactList();
  }
  closeCategoryList();
}

/**
 * Closes the "Assigned To" contact dropdown list.
 * Hides the up arrow, shows the down arrow, and hides the contact list.
 */
function closeContactList() {
  document.getElementById("assigned-to-img-up").classList.add("dp-none");
  document.getElementById("assigned-to-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-contact-list").classList.add("dp-none");
}

/**
 * Closes the contact list when clicking outside of the assigned section,
 * and prevents it from closing when clicking inside the assigned section.
 */
// Event listener for DOMContentLoaded to set up dialog and assigned section click handlers.
document.addEventListener("DOMContentLoaded", function () {
  const dialog = document.getElementById("dialogAddTask");
  const assignedSection = document.querySelector(".assigned-to-section");
  if (dialog && assignedSection) {
    initDialogClickHandler(dialog, assignedSection);
    initAssignedSectionClickHandler(assignedSection);
  }
});

/**
 * Sets up the click handler for the dialog to close the contact list if clicking outside the assigned section.
 * @param {HTMLElement} dialog - The dialog element.
 * @param {HTMLElement} assignedSection - The assigned section element.
 */
function initDialogClickHandler(dialog, assignedSection) {
  dialog.addEventListener("click", function (event) {
    if (!assignedSection.contains(event.target)) {
      closeContactList();
    }
  });
}

/**
 * Sets up the click handler for the assigned section to prevent event propagation.
 * @param {HTMLElement} assignedSection - The assigned section element.
 */
function initAssignedSectionClickHandler(assignedSection) {
  assignedSection.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

/**
 * Selects a contact from the dropdown list.
 * @param {number} i - The index of the contact in the array.
 */
function selectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "#2a3647";
  document.getElementById(`${i}`).style.color = "white";
  document.getElementById(`btn-checkbox-${i}`).src = "../assets/icons/btn-checked.svg";
  if (!selectedContacts.includes(i)) {
    selectedContacts.push(i);
    if (!selectedContactsNames.includes(contacts[i].name)) {
      selectedContactsNames.push(contacts[i].name);
    }
  }
  showSelectedAvatars();
}

/**
 * Unselects a contact from the dropdown list.
 * @param {number} i - The index of the contact in the array.
 */
function unselectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "white";
  document.getElementById(`${i}`).style.color = "black";
  document.getElementById(`${i}`).style.borderRadius = "10px";
  document.getElementById(`btn-checkbox-${i}`).src = "/assets/icons/btn-unchecked.svg";
  const index = selectedContacts.indexOf(i);
  if (index > -1) {
    selectedContacts.splice(index, 1);
  }
  removeUnSelectedAvatar(i);
  showSelectedAvatars();
}

/**
 * Toggles the selection state of a contact.
 * @param {number} i - The index of the contact in the array.
 */
function toggleContactSelection(i) {
  const contactElement = document.getElementById(i);
  contactElement.style.backgroundColor === "rgb(42, 54, 71)" ? unselectContact(i) : selectContact(i);
}

/**
 * Displays selected contact avatars in the UI.
 * Shows up to 4 avatars and a "+X" badge for extras.
 */
function showSelectedAvatars() {
  const container = document.getElementById("selected-avatars");
  const visibleContacts = selectedContacts
    .map(index => contacts[index])
    .filter(contact => contact);
  const avatarHtml = sliceVisibleContacts(visibleContacts);
  const extraCount = visibleContacts.length - 4;
  container.innerHTML = "";
  container.innerHTML =
    avatarHtml +
    (extraCount > 0
      ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>`
      : "");
}

/**
 * Creates HTML for up to 4 contact avatars.
 *
 * @param {Array<{ avatar: string, color: string }>} contacts - Contact objects to display.
 * @returns {string} HTML markup for the avatars.
 */
function sliceVisibleContacts(contacts) {
  return contacts
    .slice(0, 4)
    .map(
      contact =>
        `<div class="selected-avatar" style="background-color:${contact.color};">${contact.avatar}</div>`
    )
    .join("");
}


/**
 * Removes the avatar of an unselected contact.
 * @param {number} i - The index of the contact in the array.
 */
function removeUnSelectedAvatar(i) {
  const el = document.getElementById(`avatar-${i}`);
  if (el) el.remove(); // ✅ nur entfernen, wenn vorhanden
}

/**
 * Handles the Enter key press in the subtask input field.
 * If the input is not empty, adds the subtask and clears the input.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered on input.
 */
function createNewSubtaskOnEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault(); 
    const input = event.target;
    const value = input.value.trim();
    if (value !== "") {
      addSubtaskToList(value);
      input.value = "";
    }
  }
}

/**
 * Adds a new subtask item to the subtask list.
 *
 * @param {string} subtaskText - The text content of the subtask to add.
 */
function addSubtaskToList(subtaskText) {
  const subtaskList = document.getElementById("subtask-list");
  const subtaskItem = document.createElement("div");
  subtaskItem.classList.add("subtask-item");
  subtaskItem.innerHTML = `
    <input type="checkbox" />
    <span>${subtaskText}</span>
  `;
  subtaskList.appendChild(subtaskItem);
}
