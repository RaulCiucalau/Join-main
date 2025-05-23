let selectedContacts = [];
let selectedContactsNames = []

function renderContactList() {
  document.getElementById("drop-down-contact-list").innerHTML += "";
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    document.getElementById("drop-down-contact-list").innerHTML += contactListDropDownTemplate(indexContact);
    if (selectedContacts.includes(indexContact)) {
      selectContact(indexContact);
    }
  }
}

function showDropDownContactList(event) {
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
  document.getElementById("drop-down-contact-list").classList.add("dp-none");
  document.getElementById("assigned-to-img-up").classList.add("dp-none");
  document.getElementById("assigned-to-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-contact-list").innerHTML = "";
}

function selectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "#2a3647";
  document.getElementById(`${i}`).style.color = "white";
  document.getElementById(`btn-checkbox-${i}`).src = "./assets/icons/btn-checked.svg";
  if (!selectedContacts.includes(i)) {
    selectedContacts.push(i);
    if (!selectedContactsNames.includes(contacts[i].name)) {
      selectedContactsNames.push(contacts[i].name);
    }
  }
  showSelectedAvatars();
}

function unselectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "white";
  document.getElementById(`${i}`).style.color = "black";
  document.getElementById(`${i}`).style.borderRadius = "10px";
  document.getElementById(`btn-checkbox-${i}`).src = "./assets/icons/btn-unchecked.svg";
  const index = selectedContacts.indexOf(i);
  if (index > -1) {
    selectedContacts.splice(index, 1);
  }
  removeUnSelectedAvatar(i);
}

function toggleContactSelection(i) {
  const contactElement = document.getElementById(i);
  contactElement.style.backgroundColor === "rgb(42, 54, 71)" ? unselectContact(i) : selectContact(i);
}

function showSelectedAvatars() {
  const container = document.getElementById("selected-avatars");
  container.innerHTML = "";

  const visibleContacts = selectedContacts
    .map(index => contacts[index])
    .filter(contact => contact);

  const avatarHtml = visibleContacts
    .slice(0, 4)
    .map(contact =>
      `<div class="selected-avatar" style="background-color:${contact.color};">${contact.avatar}</div>`
    )
    .join("");

  const extraCount = visibleContacts.length - 4;
  container.innerHTML =
    avatarHtml + (extraCount > 0 ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>` : "");
}

function removeUnSelectedAvatar(i) {
  const el = document.getElementById(`avatar-${i}`);
  if (el) el.remove();
}

function selectPrio(prio) {
  const prios = ["urgent", "medium", "low"];
  prios.forEach((p) => unselectPrio(p));
  document.getElementById(`prio-img-${prio}`).src = `../assets/icons/priority-${prio}-white.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = getPrioColor(prio);
  document.getElementById(`prio-btn-${prio}`).style.color = "white";
  selectedPrio = `${prio}`;
}

function unselectPrio(prio) {
  document.getElementById(`prio-img-${prio}`).src = `../assets/icons/priority-${prio}.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = "white";
  document.getElementById(`prio-btn-${prio}`).style.color = "black";
  selectedPrio = "";
}

function togglePriority(prio) {
  if (document.getElementById(`prio-btn-${prio}`).style.color === "white") {
    unselectPrio(prio);
  } else {
    selectPrio(prio);
  }
}

function getPrioColor(prio) {
  switch (prio) {
    case "urgent":
      return "#FF3D00";
    case "medium":
      return "#FFA800";
    case "low":
      return "#7AE229";
    default:
      return "white";
  }
}