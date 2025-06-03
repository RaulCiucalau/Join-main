let selectedContacts = [];
let selectedContactsNames = [];
let subtaskIdCounter = 0;
let selectedPriority = "";
let currentTaskId = null;
let subtaskIcons = document.querySelector('dialogSubtaskEdit');

function renderContactList(taskId) {
  const assignedTo = tasks[taskId]?.assigned_to || [];
  const container = document.getElementById("drop-down-contact-list");
  container.innerHTML = "";
  if (!contacts || contacts.length === 0) return;
  resetSelectedContacts();
  contacts.forEach((contact, i) => {
    const isAssigned = assignedTo.includes(contact.name);
    container.innerHTML += contactListDropDownTemplate(contact, i, isAssigned);
    if (isAssigned) addToSelected(contact.name, i);
  });
  applySelectedStyles();
  showSelectedAvatars();
}

function resetSelectedContacts() {
  selectedContacts = [];
  selectedContactsNames = [];
}

function addToSelected(name, index) {
  selectedContacts.push(index);
  selectedContactsNames.push(name);
}

function applySelectedStyles() {
  selectedContacts.forEach(i => {
    const el = document.getElementById(i);
    const icon = document.getElementById(`btn-checkbox-${i}`);
    if (el && icon) {
      el.style.backgroundColor = "#2a3647";
      el.style.color = "white";
      icon.src = "../assets/icons/btn-checked.svg";
    }
  });
}

function showDropDownContactList(event, taskId) {
  event.stopPropagation();
  const task = tasks[taskId];
  const arrowUp = document.getElementById("assigned-to-img-up");
  const arrowDown = document.getElementById("assigned-to-img-down");
  const dropDown = document.getElementById("drop-down-contact-list");
  const isHidden = arrowUp.classList.contains("dp-none");
  if (isHidden) {
    arrowUp.classList.remove("dp-none");
    arrowDown.classList.add("dp-none");
    dropDown.classList.remove("dp-none");
    renderContactList(taskId);
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
  const contactElement = document.getElementById(`${i}`);
  const checkboxIcon = document.getElementById(`btn-checkbox-${i}`);
  const contact = contacts[i];
  if (!contactElement || !checkboxIcon || !contact) return;
  contactElement.style.backgroundColor = "#2a3647";
  contactElement.style.color = "white";
  checkboxIcon.src = "../assets/icons/btn-checked.svg";
  if (!selectedContacts.includes(i)) {
    selectedContacts.push(i);
  }
  if (!selectedContactsNames.includes(contact.name)) {
    selectedContactsNames.push(contact.name);
  }
  showSelectedAvatars();
}

function unselectContact(i) {
  const contactElement = document.getElementById(`${i}`);
  const checkboxIcon = document.getElementById(`btn-checkbox-${i}`);
  const contact = contacts[i];
  if (!contactElement || !checkboxIcon || !contact) return;
  contactElement.style.backgroundColor = "white";
  contactElement.style.color = "black";
  contactElement.style.borderRadius = "10px";
  checkboxIcon.src = "../assets/icons/btn-unchecked.svg";
  const index = selectedContacts.indexOf(i);
  if (index > -1) {
    selectedContacts.splice(index, 1);
  }
  const nameIndex = selectedContactsNames.indexOf(contact.name);
  if (nameIndex > -1) {
    selectedContactsNames.splice(nameIndex, 1);
  }
  showSelectedAvatars();
}

function toggleContactSelection(i) {
  const contactElement = document.getElementById(`${i}`);
  if (!contactElement) return;

  const isSelected = selectedContacts.includes(i);
  isSelected ? unselectContact(i) : selectContact(i);
}

function showSelectedAvatars() {
  const container = document.getElementById("selected-avatars");
  container.innerHTML = "";
  const visibleContacts = selectedContacts
    .map(index => contacts[index])
    .filter(Boolean);
  const avatarHtml = visibleContacts.slice(0, 4).map(contact => {
    const initials = getInitials(contact.name);
    return `
      <div class="selected-avatar" style="background-color: ${contact.color}">
        ${initials}
      </div>`;
  }).join("");
  const extraCount = visibleContacts.length - 4;
  container.innerHTML =
    avatarHtml + (extraCount > 0 ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>` : "");
}

function getInitials(name) {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function removeUnSelectedAvatar(i) {
  const el = document.getElementById(`avatar-${i}`);
  if (el) el.remove();
}

function selectPrio(prio) {
  const prios = ["urgent", "medium", "low"];
  prios.forEach(p => {
    document.getElementById(`prio-img-${p}`).src = `../assets/icons/priority-${p}.svg`;
    document.getElementById(`prio-btn-${p}`).style.backgroundColor = "white";
    document.getElementById(`prio-btn-${p}`).style.color = "black";
  });
  document.getElementById(`prio-img-${prio}`).src = `../assets/icons/priority-${prio}-white.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = getPrioColor(prio);
  document.getElementById(`prio-btn-${prio}`).style.color = "white";
  selectedPriority = prio;
  updateTaskPriority(prio);
}

function togglePriority(prio) {
    selectPrio(prio);
}

function updateTaskPriority(prio) {
  const task = tasks.find(t => t.id === currentTaskId);
  if (task) {
    task.priority = prio;
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

function renderEditTaskDialog(tasks, taskId) {
  currentTaskId = taskId;
  let container = document.getElementById('editTaskDialog');
  container.innerHTML = tasks.map(getEditTaskDialog).join('');
  renderContactList(taskId);
}

function openEditTaskDialogById(taskId) {
  currentTaskId = taskId;
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
            <div onmouseenter="mouseOverSubtaskEdit(this)" onmouseleave="mouseLeaveSubtaskEdit(this)" id="dialogSubtaskEdit" class="edit-dialog-subtask hover">
                <span class="subtask-text">• ${subtask.title}</span>
                <div id="subtaskEditBtns" class="subtask-list-item-btns subtask-icons-d-none">
                  <img onclick="editSelectedSubtask(${task.id}, ${task.subtasks.indexOf(subtask)})" src="../assets/icons/edit.svg" class="subtask-edit-page-icons pointer" title="Edit">
                  <img onclick="deleteSelectedTask(${task.id}, ${task.subtasks.indexOf(subtask)})" src="../assets/icons/delete.svg" class="subtask-edit-page-icons pointer" title="Delete">
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
  container.removeAttribute('onmouseenter');
  container.removeAttribute('onmouseleave');
  container.classList.remove('hover');
  container.innerHTML = `
        <div class="input-container-subtask">
          <input id="inputSubtaskEdit" type="text" class="subtask-edit-input" value="${subtask.title}">
          <div class="subtask-list-item-btns">
            <img onclick="deleteSelectedTask(${task.id}, ${task.subtasks.indexOf(subtask)})" src="../assets/icons/delete.svg" class="subtask-edit-page-icons pointer" title="Delete">
            <img onclick="saveSelectedTask(${task.id}, ${task.subtasks.indexOf(subtask)})" src="../assets/icons/check.svg" class="subtask-edit-page-icons pointer" title="Save">
           </div>
         </div>    
    `;
}

function mouseOverSubtaskEdit(element) {
  const btns = element.querySelector('.subtask-list-item-btns');
  btns.classList.remove('subtask-icons-d-none');
}

function mouseLeaveSubtaskEdit(element) {
  const btns = element.querySelector('.subtask-list-item-btns');
  btns.classList.add('subtask-icons-d-none');
}

function deleteSelectedTask(taskId, subtaskIndex) {
  const container = document.getElementById('subtasksList');
  const task = tasks[taskId];
  task.subtasks.splice(subtaskIndex, 1);
  container.innerHTML = renderSubtasksToEdit(task);
}

function saveSelectedTask(taskId, subtaskIndex) {
  const task = tasks[taskId];
  const input = document.getElementById('inputSubtaskEdit').value;
  const container = document.getElementById('subtasksList');
  task.subtasks[subtaskIndex].title = input;
  container.innerHTML = renderSubtasksToEdit(task);
}

function saveEditInputFields(taskId) {
  const task = tasks[taskId];
  const title = document.getElementById('editedTitle').value;
  const description = document.getElementById('editedDescription').value;
  const date = document.getElementById('editedDate').value;
  task.title = title;
  task.description = description;
  task.due_date = date;
}

async function updateTaskDatainAPI(taskId) {
  const task = tasks[taskId];
  saveEditInputFields(taskId);
  try {
    await fetch(`https://join-460-default-rtdb.europe-west1.firebasedatabase.app/tasks/${task.id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  } catch (error) {
    console.error("Fehler beim Schreiben in die Datenbank:", error);
  }
}

function addNewSubtaskToList(taskId) {
  const inputContainer = document.querySelector('.btns-new-subtask');
  const task = tasks[taskId];
  const text = document.getElementById('newSubtaskInput').value;
  const container = document.getElementById('subtasksList');
  if (!text) return;
  const subtaskObject = {
    id: subtaskIdCounter.toString(),
    taskId: taskId,
    title: text,
    completed: false
  };
  task.subtasks.push(subtaskObject);
  subtaskIdCounter++;
  document.getElementById('newSubtaskInput').value = '';
  container.innerHTML = renderSubtasksToEdit(task);
  inputContainer.classList.add('visibility-hidden');
}

function showBtnToAddSubtask() {
  const container = document.querySelector('.btns-new-subtask');
  container.classList.remove('visibility-hidden');
}

function cancelBtnAddSubtask() {
  const container = document.querySelector('.btns-new-subtask');
  document.getElementById('newSubtaskInput').value = '';
  container.classList.add('visibility-hidden');
}