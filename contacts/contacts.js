const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";
const USERS_PATH = "contacts/";

function getUserUrl(key = "") {
  return `${BASE_URL}${USERS_PATH}${key ? key + ".json" : ".json"}`;
}

let leftContactsList = document.getElementById("left-contact-list");
let firebaseAnswer;
let fireBase;
let users;
let user;
let contactDetailsArea;
let key;

let colours = [
  "#FF7A00", "#9327FF", "#6E52FF", "#FC71FF", "#FFBB2B",
  "#1FD7C1", "#462F8A", "#FF4646", "#00BEE8", "#FF7A00",
];

async function contactFirebase() {
  let firebaseUrl = await fetch(getUserUrl());
  firebaseAnswer = await firebaseUrl.json();
  console.log("Firebase Antwort:", firebaseAnswer);

  if (!firebaseAnswer) {
    fireBase = { users: {} };
    users = {};
    renderLeftColumnContacts();
    return;
  }

  fireBase = { users: firebaseAnswer };
  users = firebaseAnswer;
  renderLeftColumnContacts();
}

function init() {
  console.log("Init läuft!");
  contactFirebase();
  rightContactDetailsHideOnLoad();
}

function renderLeftColumnContacts() {
  leftContactsList.innerHTML = "";
  users = fireBase.users;
  let lastInitial = "";
  let sortedUserKeys = Object.keys(users).sort((a, b) =>
    users[a].name.localeCompare(users[b].name)
  );
  sortedUserKeys.forEach((keyObj, indexOfUser) => {
    let user = users[keyObj];
    let initial = user.name.charAt(0).toUpperCase();
    if (initial !== lastInitial) {
      leftContactsList.innerHTML += renderLeftColumnContactsInitalsTemplate(initial);
      lastInitial = initial;
    }
    renderLeftColumnPartTwo(user, indexOfUser, keyObj);
    makeLeftContactActive();
  });
}

function renderLeftColumnContactsInitalsTemplate(initial) {
  return `
        <div class="contact-separator">
          <span class="contact-initial">${initial}</span>
          <div class="contact-divider"></div>
        </div>`;
}

function renderLeftColumnPartTwo(user, indexOfUser, keyObj) {
  renderLeftColumnContactsTemplate(user, indexOfUser, keyObj);
  createContactNameInitials(user, indexOfUser);
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  if (userImage) {
    userImage.style.backgroundColor = user.color;
  }
}

function createContactNameInitials(user, indexOfUser) {
  let userName = user.name;
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  if (!userName) return;
  let firstLetter = userName.charAt(0);
  let secondLetter = userName.split(" ")[1]?.[0];
  userImage.innerHTML = secondLetter ? `${firstLetter}${secondLetter}` : `${firstLetter}`;
  userImage.classList.add("user-initials");
}

function rightContactDetailsHideOnLoad() {
  contactDetailsArea = document.getElementById("contact-details-area");
  contactDetailsArea.classList.add("hide");
}

function createBigContactNameInitials(user) {
  let userName = user.name;
  let firstLetter = userName.charAt(0);
  let secondLetter = userName.split(" ")[1]?.[0];
  let bigCredentialsArea = document.getElementById("user-picture-big-index");
  bigCredentialsArea.innerHTML = secondLetter ? `${firstLetter}${secondLetter}` : `${firstLetter}`;
}

function hideContactDetails(users) {
  let rightColumn = document.getElementById("right-contacts-page-column");
  let leftColumn = document.getElementById("left-contacts-page-column");
  rightColumn.style.display = "none";
  leftColumn.style.display = "block";
  document.getElementById("overlayButton").style.display = "none";
}

function makeLeftContactActive() {
  const contactListItems = document.querySelectorAll(".contact-list");
  contactListItems.forEach((item) => {
    item.addEventListener("click", () => {
      contactListItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function renderRightContactArea(name, email, phone, paramKey, users) {
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) overlayButton.style.display = "block";
  makeLeftContactActive();
  handleResponsiveView(paramKey, users);
  updateContactDetails(name, email, phone, paramKey, users);
  updateUserDetails(paramKey, users);
}

function handleResponsiveView(paramKey, users) {
  if (window.innerWidth < 1250) {
    let rightColumn = document.getElementById("right-contacts-page-column");
    let leftColumn = document.getElementById("left-contacts-page-column");
    let userContactHeader = document.getElementById("user-contact-header");
    rightColumn.style.display = "flex";
    userContactHeader.innerHTML = `<button class="go-back-arrow" onclick="hideContactDetails(users)">
                                    <img src="/assets/img/back-arrow.svg">
                                   </button>`;
    leftColumn.style.display = "none";
    rightColumn.style.display = "block";
    handleOverlayButton(paramKey, users);
  }
}

function updateContactDetails(name, email, phone, paramKey, users) {
  contactDetailsAreaTemplate(paramKey, users);
  hideContactOptionsForMobile();
  document.getElementById("big-user-name").innerText = name;
  let rightEmailArea = document.getElementById("user-email");
  rightEmailArea.innerHTML = `${email}<br>`;
  rightEmailArea.href = `mailto:${email}`;
  document.getElementById("user-phone-number").innerText = phone;
  document.getElementById("contact-to-trash").onclick = () =>
    deleteContactFromDatabase(paramKey, users);
  document.getElementById("contact-edit").onclick = () =>
    editContact(paramKey, users);
}

function updateUserDetails(paramKey, users) {
  let user = users[paramKey];
  createBigContactNameInitials(user);
  bigRandomColour(user);
}

async function deleteContactFromDatabase(key, users) {
  let deleteUrl = getUserUrl(key);
  try {
    await fetch(deleteUrl, { method: "DELETE" });
    contactsuccessfullyDeletedNotification();
    delete users[key];
    renderLeftColumnContacts();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

function editContact(paramKey, users) {
  editContactOverlay(paramKey, users);
}

function stopPropagation(event) {
  event.stopPropagation();
}

function displayPhoneNumber(user) {
  document.getElementById("user-phone-number").innerText = user.phone;
}

function applyRandomColors() {
  let userPictures = document.getElementsByClassName("user-initials user-icon");
  Array.from(userPictures).forEach((element, index) => {
    let userKeys = Object.keys(users);
    let userKey = userKeys[index];
    element.style.backgroundColor = users[userKey].color;
  });
}

function bigRandomColour(user) {
  let bigInitialsArea = document.getElementById("user-picture-big-index");
  if (bigInitialsArea && user.color) {
    bigInitialsArea.style.backgroundColor = user.color;
  }
}

function hideContactOptionsForMobile() {
  let userNameOptions = document.getElementById("user-name-options");
  if (window.innerWidth < 1250) {
    userNameOptions.style.display = "none";
  }
}

function addContactToDatabase(event) {
  event.preventDefault();
  const form = document.getElementById("addContactForm");
  if (!form.checkValidity()) return false;

  let name = document.getElementById("fullName").value;
  let email = document.getElementById("new-email").value;
  let phone = document.getElementById("new-phone").value;
  let color = colours[Math.floor(Math.random() * colours.length)];

  fetch(getUserUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, e_mail: email, phone, color }),
  })
    .then(() => {
      closeAddContactOverlay();
      contactsuccessfullyAddedNotification();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((error) => {
      console.error("Error adding contact:", error);
    });
  return false;
}

async function saveEditedContact(key) {
  let name = document.getElementById("fullName").value;
  let email = document.getElementById("new-email").value;
  let phone = document.getElementById("new-phone").value;
  try {
    await fetch(getUserUrl(key), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, e_mail: email, phone }),
    });
    closeEditOverlay();
    contactsuccessfullyEditedNotification();
    contactFirebase();
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

