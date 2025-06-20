let selectedContactsId = [];
let selectedContactsName = [];
let subtaskIdCount = 0;
let selectedPrioritys = "";
let currentTaskIds = null;
let subtaskIcons = document.querySelector('dialogSubtaskEdit');

function renderAssigneeList(taskId) {
  const assignedTo = tasks[taskId]?.assigned_to || [];
  const container = document.getElementById("assignee-dropdown-list");
  container.innerHTML = "";
  if (!contacts || contacts.length === 0) return;
  resetSelectedContacts(taskId);
  contacts.forEach((contact, i) => {
    const isAssigned = assignedTo.includes(contact.name);
    container.innerHTML += contactListTemplate(contact, i, isAssigned, taskId);
    if (isAssigned) addToSelected(contact.name, i);
  });
  applySelectedStyles(taskId);
}

function resetSelectedContacts() {
  selectedContactsId = [];
  selectedContactsNames = [];
}

function addToSelected(name, index) {
  selectedContactsId.push(index);
  selectedContactsName.push(name);
}

function applySelectedStyles(taskId) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  if (!task || !task.assigned_to) return;
  task.assigned_to.forEach(name => {
    const contactIndex = contacts.findIndex(c => c.name === name);
    if (contactIndex !== -1) {
      const el = document.getElementById(`contactId${contactIndex}`);
      const icon = document.getElementById(`checkBox${contactIndex}`);
      if (el && icon) {
        el.style.backgroundColor = "#2a3647";
        el.style.color = "white";
        icon.src = "../assets/icons/btn-checked.svg";
      }
    }
  });
}

function toggleAssigneeDropdown(event, taskId) {
  event.stopPropagation();
  const task = tasks[taskId];
  if (document.getElementById("assignee-img-up").classList.contains("dp-none")) {
    document.getElementById("assignee-img-up").classList.remove("dp-none");
    document.getElementById("assignee-img-down").classList.add("dp-none");
    document.getElementById("assignee-input").classList.add("border-show-menu");
    document.getElementById("assignee-input").classList.add("hover-border");
    document.getElementById("assignee-dropdown-list").classList.remove("dp-none");
    renderAssigneeList(taskId);
  } else {
    closeDropDownList();
    document.getElementById("assignee-input").classList.add("hover-border");
    document.getElementById("assignee-input").classList.remove("border-show-menu");
  }
}

function closeDropDownList() {
  document.getElementById("assignee-dropdown-list").classList.add("dp-none");
  document.getElementById("assignee-img-up").classList.add("dp-none");
  document.getElementById("assignee-img-down").classList.remove("dp-none");
  document.getElementById("assignee-dropdown-list").innerHTML = "";
}

function toggleContactChosed(index, taskId) {
  const contact = contacts[index];
  if (!contact) return;
  const task = tasks.find(t => t.id == taskId);
  if (!task) return;

  if (!task.assigned_to) {
    task.assigned_to = [];
  }
  const contactName = contact.name;
  const isAlreadyAssigned = task.assigned_to.includes(contactName);
  const contactText = document.getElementById(`contactName${index}`);
  const contactElement = document.getElementById(`contactId${index}`);
  const checkBoxIcon = document.getElementById(`checkBox${index}`);
  if (isAlreadyAssigned) {
    // Remove from assigned_to
    const pos = task.assigned_to.indexOf(contactName);
    task.assigned_to.splice(pos, 1);
    contactText.style.color = "black";
    contactElement.style.backgroundColor = "white";
    checkBoxIcon.src = "../assets/icons/btn-unchecked.svg";
  } else {
    // Add to assigned_to
    task.assigned_to.push(contactName);
    contactText.style.color = "white";
    contactElement.style.backgroundColor = "#2a3647";
    checkBoxIcon.src = "../assets/icons/btn-checked.svg";
  }
  renderChosenAvatars();
}

function renderChosenAvatars() {
  const container = document.getElementById("assignee-selected-avatars");
  container.innerHTML = "";
  const visibleContacts = selectedContactsId
    .map(index => contacts[index])
    .filter(contact => contact);
  const avatarHtml = visibleContacts
    .slice(0, 4)
    .map(contact =>
      `<div class="selected-avatars" style="background-color:${contact.color};">${contact.avatar}</div>`
    )
    .join("");
  const extraCount = visibleContacts.length - 4;
  container.innerHTML =
    avatarHtml + (extraCount > 0 ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>` : "");
}

function selectPrio(prio) {
  const prios = ["urgent", "medium", "low"];
  prios.forEach(p => {
    document.getElementById(`prios-img-${p}`).src = `../assets/icons/priority-${p}.svg`;
    document.getElementById(`prios-btn-${p}`).style.backgroundColor = "white";
    document.getElementById(`prios-btn-${p}`).style.color = "black";
  });
  document.getElementById(`prios-img-${prio}`).src = `../assets/icons/priority-${prio}-white.svg`;
  document.getElementById(`prios-btn-${prio}`).style.backgroundColor = getPrioColor(prio);
  document.getElementById(`prios-btn-${prio}`).style.color = "white";
  selectedPrioritys = prio;
  updateTaskPrioritys(prio);
}

function togglePrioritys(prio) {
  selectPrio(prio);
}

function updateTaskPrioritys(prio) {
  const task = tasks.find(t => t.id === currentTaskId);
  if (task) {
    task.priority = prio;
  }
}

function getPrioColors(prio) {
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
  currentTaskIds = taskId;
  let container = document.getElementById('editTaskDialog');
  container.innerHTML = tasks.map(getEditTaskDialog).join('');
  renderAssigneeList(taskId);
}

function openEditTaskDialogById(taskId) {
  currentTaskIds = taskId;
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
  const task = tasks.find(t => String(t.id) === String(taskId));
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
  const task = tasks.find(t => String(t.id) === String(taskId));
  task.subtasks.splice(subtaskIndex, 1);
  container.innerHTML = renderSubtasksToEdit(task);
}

function saveSelectedTask(taskId, subtaskIndex) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  const input = document.getElementById('inputSubtaskEdit').value;
  const container = document.getElementById('subtasksList');
  task.subtasks[subtaskIndex].title = input;
  container.innerHTML = renderSubtasksToEdit(task);
}

function saveEditInputFields(taskId) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  const titleInput = document.getElementById(`editedTitle-${taskId}`).value;
  const descriptionInput = document.getElementById(`editedDescription-${taskId}`).value;
  const dateInput = document.getElementById(`editedDate-${taskId}`).value;
  task.title = titleInput;
  task.description = descriptionInput;
  task.due_date = dateInput;
  task.priority = selectedPrioritys;
  if (selectedContactsNames && selectedContactsNames.length > 0) {
    if (!task.assigned_to) {
      task.assigned_to = [];
    }
    selectedContactsNames.forEach(name => {
      if (!task.assigned_to.includes(name)) {
        task.assigned_to.push(name);
      }
    });
  }
}

async function updateTaskDatainAPI(taskId) {
  const task = tasks.find(t => String(t.id) === String(taskId));
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
  removeEditDialog();
  renderCards(tasks);
}

function removeEditDialog() {
  let container = document.querySelector('.dialog-container');
  container.classList.add('d-none-edit-dialog');
}

function addNewSubtaskToList(taskId) {
  const inputContainer = document.querySelector('.btns-new-subtask');
  const task = tasks.find(t => String(t.id) === String(taskId));
  const text = document.getElementById('newSubtaskInput').value;
  const container = document.getElementById('subtasksList');
  const maxSubtaskId = task.subtasks.reduce((max, subtask) => {
    return Math.max(max, parseInt(subtask.id) || 0);
  }, 0);
  const newSubtaskId = maxSubtaskId + 1
  if (!text) return;
  const subtaskObject = {
    id: newSubtaskId.toString(),
    taskId: taskId,
    title: text,
    completed: false
  };
  task.subtasks.push(subtaskObject);
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
  const input = document.getElementById('subtaskContainer');
  document.getElementById('newSubtaskInput').value = '';
  container.classList.add('visibility-hidden');
  input.classList.remove('blue-border-input');
}

function createSubtaskOnEnter(taskId) {
  if (event.key === "Enter") {
    addNewSubtaskToList(taskId)
    showBtnToAddSubtask();
  }
}
