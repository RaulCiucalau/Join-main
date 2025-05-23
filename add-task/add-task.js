let selectedColumn = "to-do";
let tasksArr = [];
let selectedContacts = [];
let selectedContactsNames = [];
let selectedPrio = "medium";
let subtasks = [];
let contacts = [];
let currentMaxId = 3; // startet bei 3, damit die nächste ID 4 ist

async function loadContacts(path) {
  try {
    const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/contacts.json");
    const data = await response.json();

    if (data) {
      contacts = Object.values(data).filter(c => c !== null).map(user => {
        const firstLetter = user.name.charAt(0).toUpperCase();
        const secondLetter = user.name.split(" ")[1]?.[0]?.toUpperCase();
        return {
          ...user,
          avatar: secondLetter ? `${firstLetter}${secondLetter}` : firstLetter
        };
      });
    } else {
      contacts = [];
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte aus Firebase:", error);
  }
}

async function init() {
  await loadContacts("contactList");
  await loadTasks("tasks"); // ✅ korrektes Datenbankverzeichnis
  await showLoggedInInfo();
  highlightMenuActual();
}

function renderContactList() {
  const list = document.getElementById("drop-down-contact-list");
  list.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    list.innerHTML += contactListDropDownTemplate(i);
    if (selectedContacts.includes(i)) {
      selectContact(i);
    }
  }
}

function showContactList(event) {
  event.stopPropagation();
  const list = document.getElementById("drop-down-contact-list");
  const up = document.getElementById("assigned-to-img-up");
  const down = document.getElementById("assigned-to-img-down");

  if (up.classList.contains("dp-none")) {
    up.classList.remove("dp-none");
    down.classList.add("dp-none");
    list.classList.remove("dp-none");
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
  showSelectedAvatar(i);
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

function showSelectedAvatar(i) {
  const container = document.getElementById("selected-avatars");
  const element = document.getElementById(`avatar-${i}`);
  if (!element) {
    container.innerHTML += `<div class="selected-avatar" style="background-color:${contacts[i].color};" id="avatar-${i}">${contacts[i].avatar}</div>`;
  }
  const selectedAvatars = selectedContacts
    .slice(0, 4)
    .map(index =>
      `<div class="selected-avatar" style="background-color:${contacts[index].color};">${contacts[index].avatar}</div>`
    ).join("");
  const extraCount = selectedContacts.length - 4;
  container.innerHTML = selectedAvatars + (extraCount > 0 ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>` : "");
}

function removeUnSelectedAvatar(i) {
  const el = document.getElementById(`avatar-${i}`);
  if (el) el.remove();
}

function createTask() {
  if (areInputsEmpty()) {
    showFieldRequired();
  } else if (!canSaveTask()) {
    errorTaskAlreadyExists();
  } else {
    saveTaskInputs();
    showLog();
    goToBoards();
  }
}

function saveTaskInputs() {
  if (canSaveTask()) {
    let id = generateUniqueId();
    console.log("Vergebene ID:", id);
    const task = createTaskObject(id);
    tasksArr.push(task);
    addTaskToDatabase(id, task);
  } else {
    console.log("Task already exists or the input fields are empty");
  }
}

function createTaskObject(id) {
  return {
    id: id,
    column: selectedColumn,
    status: "ToDo",
    assigned_to: [...selectedContactsNames],
    category: getCategoryInput(),
    due_date: getDateInput(),
    description: getDescriptionInput(),
    priority: capitalizeFirstLetter(selectedPrio),
    subtasks: getSubtasksArray(),
    title: getTitleInput(),
  };
}

function getTitleInput() {
  return document.getElementById("add-task-title").value;
}

function getDateInput() {
  return document.getElementById("add-task-due-date").value;
}

function getCategoryInput() {
  return document.getElementById("category").value;
}

function getDescriptionInput() {
  return document.getElementById("add-task-description").value;
}

function getAssignedTo() {
  return mapArrayToObject(selectedContactsNames);
}

function getSubtasks() {
  return mapArrayToObject(subtasks);
}

function canSaveTask() {
  const titleInput = document.getElementById("add-task-title").value;
  return !taskAlreadyExists(tasksArr, titleInput);
}

function areInputsEmpty() {
  const t = (id) => document.getElementById(id),
        d = t("add-task-due-date"),
        [e, p] = t("required-date").querySelectorAll("p");
  let i = !t("add-task-title").value.trim() || !t("category").value.trim(),
      v = d.value,
      today = new Date();
  today.setHours(0, 0, 0, 0);
  [e, p, t("required-date")].forEach(el => el.classList.add("dp-none"));
  if (!v) {
    e.classList.remove("dp-none");
    t("required-date").classList.remove("dp-none");
    i = true;
  } else if (new Date(v) < today) {
    p.classList.remove("dp-none");
    t("required-date").classList.remove("dp-none");
    d.style.border = "1px solid red";
    i = true;
  }
  return i;
}

function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some(task => task.title === title);
}

function showFieldRequired() {
  if (document.getElementById("add-task-title").value.trim() === "") {
    document.getElementById("add-task-title").style.border = "1px solid red";
    document.getElementById("required-title").classList.remove("dp-none");
  }
  if (document.getElementById("add-task-due-date").value.trim() === "") {
    document.getElementById("required-date").classList.remove("dp-none");
    document.getElementById("add-task-due-date").style.border = "1px solid red";
  }
  if (document.getElementById("category").value.trim() === "") {
    document.getElementById("category").style.border = "1px solid red";
    document.getElementById("required-category").classList.remove("dp-none");
  }
}

function showLog() {
  document.getElementById("log").innerHTML = `<div class="added-to-board-msg">
    <p>Task added to board</p>
    <img src="./assets/icons/added-to-board.svg" alt="Board image" />
  </div>`;
}

function goToBoards() {
  setTimeout(() => {
    window.location.href = "./board/board.html";
  }, 1000);
}

async function addTaskToDatabase(id, task) {
  try {
    await fetch(`https://join-460-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  } catch (error) {
    console.error("Fehler beim Schreiben in die Datenbank:", error);
  }
}

function clearTaskForm() {
  subtasks = [];
  clearInputs();
  changeSubtaskButtons();
  unselectPrio("urgent");
  unselectPrio("low");
  selectPrio("medium");
  selectedContacts = [];
  selectedContactsNames = [];
  removeFieldRequired();
}

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

function removeFieldRequired() {
  document.getElementById("required-title").classList.add("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid #d1d1d1";
  document.getElementById("required-date").classList.add("dp-none");
  document.getElementById("add-task-due-date").style.border = "1px solid #d1d1d1";
  document.getElementById("required-category").classList.add("dp-none");
  document.getElementById("category").style.border = "1px solid #d1d1d1";
}

function errorTaskAlreadyExists() {
  document.getElementById("task-already-exists").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
}

function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

function mapArrayToObject(array) {
  return array.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

function generateUniqueId() {
  currentMaxId += 1;
  return String(currentMaxId);
}

async function loadTasks(path = "tasks") {
  try {
    const response = await fetch(`https://join-460-default-rtdb.europe-west1.firebasedatabase.app/${path}.json`);
    const data = await response.json();

    if (data) {
      tasksArr = Object.values(data);
      const ids = Object.keys(data).map(id => Number(id)).filter(id => !isNaN(id));
      currentMaxId = ids.length ? Math.max(...ids) : 3;
    } else {
      tasksArr = [];
      currentMaxId = 3;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks aus Firebase:", error);
  }
}

async function showLoggedInInfo() {
  try {
    const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/login.json");
    const loginInfo = await response.json();
    if (loginInfo?.[0]?.isGuestLoggedIn) {
      document.getElementById("initialLetter").innerText = "G";
    } else {
      const avatar = loginInfo?.[0]?.userLoggedIn?.avatar || "?";
      document.getElementById("initialLetter").innerText = avatar;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Login-Info:", error);
    document.getElementById("initialLetter").innerText = "?";
  }
}

function highlightMenuActual() {
  const path = window.location.pathname;
  const menuLinks = document.querySelectorAll(".nav-link");
  menuLinks.forEach(link => {
    if (path.includes(link.getAttribute("href"))) {
      link.classList.add("nav-active");
    } else {
      link.classList.remove("nav-active");
    }
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getSubtasksArray() {
  return subtasks.map(title => ({ title: title, completed: false }));
}
