let selectedContacts = [];
let selectedContactsNames = [];

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

function closeContactList() {
  document.getElementById("assigned-to-img-up").classList.add("dp-none");
  document.getElementById("assigned-to-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-contact-list").classList.add("dp-none");
}

document.addEventListener("DOMContentLoaded", function () {
  const dialog = document.getElementById("dialogAddTask");
  const assignedSection = document.querySelector(".assigned-to-section");
  if (dialog && assignedSection) {
    dialog.addEventListener("click", function (event) {
      if (!assignedSection.contains(event.target)) {
        closeContactList();
      }
    });
    assignedSection.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
});

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
  document.getElementById(`btn-checkbox-${i}`).src = "../assets/icons/btn-unchecked.svg";
  const index = selectedContacts.indexOf(i);
  if (index > -1) {
    selectedContacts.splice(index, 1);
  }
  removeUnSelectedAvatar(i);
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
 * Displays the avatar of a selected contact.
 * Shows only up to 4 avatars, and if there are more, displays a "+X" bubble.
 * @param {number} i - The index of the contact in the array.
 */
function showSelectedAvatars() {
  const container = document.getElementById("selected-avatars");
  container.innerHTML = "";

  const visibleContacts = selectedContacts
    .map(index => contacts[index])
    .filter(contact => contact);

  const avatarHtml = sliceVisibleContacts();
  const extraCount = visibleContacts.length - 4;
  container.innerHTML =
   avatarHtml + (extraCount > 0 ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>` : "");

 function sliceVisibleContacts() {
    return visibleContacts
      .slice(0, 4)
      .map(contact => `<div class="selected-avatar" style="background-color:${contact.color};">${contact.avatar}</div>`
      )
      .join("");
  }
}

/**
 * Removes the avatar of an unselected contact.
 * @param {number} i - The index of the contact in the array.
 */
function removeUnSelectedAvatar(i) {
  const el = document.getElementById(`avatar-${i}`);
  if (el) el.remove(); // ✅ nur entfernen, wenn vorhanden
}

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
