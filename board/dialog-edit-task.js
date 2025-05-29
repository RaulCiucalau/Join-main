let selectedContacts = [];
let selectedContactsNames = []
let currentTaskId = 0;
let subtaskIcons = document.querySelector('dialogSubtaskEdit');

function renderContactList() {
  const container = document.getElementById("drop-down-contact-list");
  container.innerHTML = "";

  const assignedTo = tasks[currentTaskId].assigned_to;

  for (let i = 0; i < assignedTo.length; i++) {
    const contact = assignedTo[i];
    container.innerHTML += contactListDropDownTemplate(contact, i);

    if (selectedContacts.includes(i)) {
      selectContact(i);
    }
  }
}

function showDropDownContactList(event) {
  event.stopPropagation();

  const arrowUp = document.getElementById("assigned-to-img-up");
  const arrowDown = document.getElementById("assigned-to-img-down");
  const dropDown = document.getElementById("drop-down-contact-list");

  const isHidden = arrowUp.classList.contains("dp-none");

  if (isHidden) {
    arrowUp.classList.remove("dp-none");
    arrowDown.classList.add("dp-none");
    dropDown.classList.remove("dp-none");
    renderContactList();
  } else {
    closeContactList();
  }
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
  document.getElementById(`btn-checkbox-${i}`).src = "../assets/icons/btn-checked.svg";
  if (!selectedContacts.includes(i)) {
    selectedContacts.push(i);
    if (!selectedContactsNames.includes(tasks.assigned_to[i])) {
      selectedContactsNames.push(tasks.assigned_to[i]);
    }
  }
  showSelectedAvatars();
}

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

function toggleContactSelection(index) {
  if (selectedContacts.includes(index)) {
    unselectContact(index);
  } else {
    selectContact(index);
  }
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

function toggleEditTaskDialog() {
  let editDialog = document.getElementById('editTaskDialog');
  editDialog.classList.toggle('d-none-edit-dialog');
}

function renderEditTaskDialog(tasks) {
  let container = document.getElementById('editTaskDialog');
  container.innerHTML = tasks.map(getEditTaskDialog).join('');
  eventListeners();
}

function openEditTaskDialogById(taskId) {
  const task = tasks.find(task => task.id === taskId);
  const bigDialog = document.getElementById('bigTaskDialog');
  const editDialog = document.getElementById('editTaskDialog');
  bigDialog.classList.add('d-none-big-dialog');
  editDialog.innerHTML = getEditTaskDialog(task);
  editDialog.classList.remove('d-none-edit-dialog');
  renderPriorityFromAPI(task);
}

function renderPriorityFromAPI(task) {
  if (!task || !task.priority) return;
  const prio = task.priority.toLowerCase();
  const validPrios = ["urgent", "medium", "low"];
  if (validPrios.includes(prio)) {
    selectPrio(prio);
  }
}

function renderSubtasksToEdit(task) {
  return task.subtasks.map(subtask => {
    return `
            <div id="dialogSubtaskEdit" class="edit-dialog-subtask">
                <span class="subtask-text">• ${subtask.title}</span>
                <div class="subtask-list-item-btns">
                  <img onclick="editSelectedSubtask(${task.id}, ${task.subtasks.indexOf(subtask)})" src="../assets/icons/edit.svg" class="subtask-edit-page-icons subtask-icons-d-none pointer" title="Edit">
                  <img src="../assets/icons/delete.svg" class="subtask-edit-page-icons subtask-icons-d-none pointer" title="Delete">
                </div>
            </div>
        `;
  }).join('');
}

function editSelectedSubtask(taskId, subtaskIndex) {
  const task = tasks[taskId];
  const subtask = task.subtasks[subtaskIndex];
  const subtaskElements = document.querySelectorAll('.edit-dialog-subtask');
  const container = subtaskElements[subtaskIndex];
  container.innerHTML = `
        <div class="input-container-subtask">
          <input type="text" class="subtask-edit-input" value="${subtask.title}">
          <div class="subtask-list-item-btns">
            <img onclick="" 
              src="../assets/icons/check.svg" 
              class="subtask-edit-page-icons pointer" 
              title="Save">
            <img onclick="" 
              src="../assets/icons/cancel.svg" 
              class="subtask-edit-page-icons pointer" 
              title="Cancel">
           </div>
         </div>    
    `;
}