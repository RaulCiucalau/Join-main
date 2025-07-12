/** Base URL for Firebase database */
const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";
/** Firebase path for user contacts */
const USERS_PATH = "contacts/";

/**
 * Constructs the full URL to access user data in Firebase.
 * @param {string} [key=""] - Optional key for a specific user.
 * @returns {string} The full Firebase URL.
 */
function getUserUrl(key = "") {
  return `${BASE_URL}${USERS_PATH}${key ? key + ".json" : ".json"}`;
}

// DOM elements and global variables
let leftContactsList = document.getElementById("left-contact-list");
let firebaseAnswer;
let fireBase;
let users;
let user;
let contactDetailsArea;
let key;

/** Array of predefined colors for user avatars */
let colours = [
  "#FF7A00", "#9327FF", "#6E52FF", "#FC71FF", "#FFBB2B",
  "#1FD7C1", "#462F8A", "#FF4646", "#00BEE8", "#FF7A00",
];

/**
 * Fetches user contacts from Firebase and renders them.
 */
async function contactFirebase() {
  let firebaseUrl = await fetch(getUserUrl());
  firebaseAnswer = await firebaseUrl.json();


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

/**
 * Initializes the application.
 */
function init() {
  
  contactFirebase();
  rightContactDetailsHideOnLoad();
  checkOrientation();
}

/**
 * Renders the left column of contact list grouped by initials.
 */
function renderLeftColumnContacts() {
  leftContactsList.innerHTML = "";
  users = fireBase.users;

  let validUserKeys = Object.keys(users).filter(key => users[key] !== null);

  let lastInitial = "";
  let sortedUserKeys = validUserKeys.sort((a, b) =>
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

/**
 * Returns HTML template for a contact initial section.
 * @param {string} initial - First letter of a contact group.
 * @returns {string} HTML string.
 */
function renderLeftColumnContactsInitalsTemplate(initial) {
  return `
        <div class="contact-separator">
          <span class="contact-initial">${initial}</span>
          <div class="contact-divider"></div>
        </div>`;
}

/**
 * Handles rendering and style setup for a single contact.
 * @param {object} user - User data object.
 * @param {number} indexOfUser - Index of the user.
 * @param {string} keyObj - Firebase key of the user.
 */
function renderLeftColumnPartTwo(user, indexOfUser, keyObj) {
  renderLeftColumnContactsTemplate(user, indexOfUser, keyObj);
  createContactNameInitials(user, indexOfUser);
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  if (userImage) {
    userImage.style.backgroundColor = user.color;
  }
}

/**
 * Creates user initials and sets them in the avatar.
 * @param {object} user - User data object.
 * @param {number} indexOfUser - Index of the user.
 */
function createContactNameInitials(user, indexOfUser) {
  let userName = user.name;
  let userImage = document.getElementById(`user-icon${indexOfUser}`);
  if (!userName) return;
  let firstLetter = userName.charAt(0);
  let secondLetter = userName.split(" ")[1]?.[0];
  userImage.innerHTML = secondLetter ? `${firstLetter}${secondLetter}` : `${firstLetter}`;
  userImage.classList.add("user-initials");
}

/**
 * Hides the right contact details area on load.
 */
function rightContactDetailsHideOnLoad() {
  contactDetailsArea = document.getElementById("contact-details-area");
  contactDetailsArea.classList.add("hide");
}

/**
 * Sets the large initials for the detailed contact view.
 * @param {object} user - User data object.
 */
function createBigContactNameInitials(user) {
  let userName = user.name;
  let firstLetter = userName.charAt(0);
  let secondLetter = userName.split(" ")[1]?.[0];
  let bigCredentialsArea = document.getElementById("user-picture-big-index");
  bigCredentialsArea.innerHTML = secondLetter ? `${firstLetter}${secondLetter}` : `${firstLetter}`;
}

/**
 * Shows only the left contact list and hides right column (responsive).
 */
function hideContactDetails(users) {
  let rightColumn = document.getElementById("right-contacts-page-column");
  let leftColumn = document.getElementById("left-contacts-page-column");
  rightColumn.style.display = "none";
  leftColumn.style.display = "block";
}

/**
 * Adds event listeners to make selected contact active.
 */
function makeLeftContactActive() {
  const contactListItems = document.querySelectorAll(".contact-list");
  contactListItems.forEach((item) => {
    item.addEventListener("click", () => {
      contactListItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

/**
 * Renders the right contact details pane.
 */
function renderRightContactArea(name, email, phone, paramKey, users) {
  let overlayButton = document.getElementById("overlayButton");
  if (overlayButton) overlayButton.style.display = "block";
  makeLeftContactActive();
  handleResponsiveView(paramKey, users);
  updateContactDetails(name, email, phone, paramKey, users);
  updateUserDetails(paramKey, users);
}

/**
 * Handles responsive behavior when viewing contact details.
 */
function handleResponsiveView(paramKey, users) {
  if (window.innerWidth < 1250) {
    let rightColumn = document.getElementById("right-contacts-page-column");
    let leftColumn = document.getElementById("left-contacts-page-column");
    let userContactHeader = document.getElementById("user-contact-header");
    rightColumn.style.display = "flex";
    userContactHeader.innerHTML = `<button class="go-back-arrow" onclick="hideContactDetails(users)">
                                    <img src="/assets/icons/back-arrow.svg">
                                   </button>`;
    leftColumn.style.display = "none";
    rightColumn.style.display = "block";
    handleOverlayButton(paramKey, users);
  }
}

/**
 * Finds a user by their key.
 * @param {string} paramKey - Firebase key.
 * @param {object[]} users - Users object.
 * @returns {object|null} The matching user or null.
 */
function findUserByKey(paramKey, users) {
  const stringKey = JSON.stringify(paramKey);
  for (let i = 0; i < users.length; i++) {
    if (JSON.stringify(users[i].id) === stringKey) {
      return users[i];
    }
  }
  return null;
}

/**
 * Renders overlay content for responsive user detail view.
 */
function handleOverlayButton(paramKey, users) {
  const matchedUser = findUserByKey(paramKey, users);
  if (!matchedUser) return;
  const userData = matchedUser.data || matchedUser;
  const rightColumn = document.getElementById("right-contacts-page-column");
  rightColumn.innerHTML = "";
  const userDetails = document.createElement("div");
  userDetails.className = "user-details";
  userDetails.innerHTML = `
    <h2>${userData.name}</h2>
    <p>Email: ${userData.email}</p>
    <p>Phone: ${userData.phone}</p>
  `;
  rightColumn.appendChild(userDetails);
}

/**
 * Updates the contact detail fields with new data.
 */
function updateContactDetails(name, email, phone, paramKey, users) {
  contactDetailsAreaTemplate(paramKey, users);
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

/**
 * Updates user detail styles and initials for large view.
 */
function updateUserDetails(paramKey, users) {
  let user = users[paramKey];
  createBigContactNameInitials(user);
  bigRandomColour(user);
}

/**
 * Deletes a contact from Firebase and re-renders the contact list.
 */
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
  renderLeftColumnContacts();
}

/**
 * Triggers the contact edit overlay.
 */
function editContact(paramKey, users) {
  editContactOverlay(paramKey, users);
}

/**
 * Stops event propagation.
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Displays the user's phone number in the UI.
 */
function displayPhoneNumber(user) {
  document.getElementById("user-phone-number").innerText = user.phone;
}

/**
 * Applies saved colors to user avatar icons.
 */
function applyRandomColors() {
  let userPictures = document.getElementsByClassName("user-initials user-icon");
  Array.from(userPictures).forEach((element, index) => {
    let userKeys = Object.keys(users);
    let userKey = userKeys[index];
    element.style.backgroundColor = users[userKey].color;
  });
}

/**
 * Applies background color to the large initials avatar.
 */
function bigRandomColour(user) {
  let bigInitialsArea = document.getElementById("user-picture-big-index");
  if (bigInitialsArea && user.color) {
    bigInitialsArea.style.backgroundColor = user.color;
  }
}

/**
 * Saves changes to an edited contact in Firebase.
 */
async function saveEditedContact(key) {
  const nameValid = isNameValid("fullName");
  const emailValid = isEmailValid("new-email");
  const phoneValid = isPhoneValid("new-phone");
  if (!nameValid || !emailValid || !phoneValid) return;
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("new-email").value.trim();
  const phone = document.getElementById("new-phone").value.trim();
  try {
    await fetch(getUserUrl(key), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, e_mail: email, phone }),
    });
    closeEditOverlay();
    contactFirebase();
    renderRightContactArea(name, email, phone, key, users);
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

/**
 * Adds a new contact to Firebase.
 */
async function addNewContactToDatabase(name, email, phone) {
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("new-email");
  const phoneInput = document.getElementById("new-phone");

  const nameError = nameInput.closest(".input-group")?.querySelector(".error-message");
  const emailError = emailInput.closest(".input-group")?.querySelector(".error-message");
  const phoneError = phoneInput.closest(".input-group")?.querySelector(".error-message");

  name = name.trim();
  email = email.trim();
  phone = phone.trim();

  let valid = true;

 
  nameError.innerText = "";
  emailError.innerText = "";
  phoneError.innerText = "";

 
  if (/\d/.test(name)) {
    nameError.innerText = "Name darf keine Zahlen enthalten.";
    valid = false;
  }

  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.innerText = "Ungültige E-Mail-Adresse.";
    valid = false;
  }

  
  if (!/^\d+$/.test(phone)) {
    phoneError.innerText = "Telefonnummer darf nur Zahlen enthalten.";
    valid = false;
  }

  if (!valid) return;

  const randomColor = colours[Math.floor(Math.random() * colours.length)];
  const initials = name
    .trim()
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');

  const newContact = {
    name: name,
    e_mail: email,
    phone: phone,
    color: randomColor,
    avatar: initials
  };

  try {
    await fetch(getUserUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });

    closeAddContactOverlay();
    contactFirebase();
  } catch (error) {
    console.error("Fehler beim Speichern in Firebase:", error);
  }
}

function closeContactList() {
  const detailContainer = document.getElementById("contact-details");
  if (detailContainer) {
    detailContainer.classList.add("dp-none");
  }
}


// Initial load event
document.addEventListener('DOMContentLoaded', () => {
  init();
});

/**
 * Closes the edit contact overlay.
 */
function closeEditOverlay() {
  let container = document.getElementById('outer-edit-contact-overlay');
  container.classList.add('display-none-overlay');
}

/**
 * Closes the add contact overlay.
 */
function closeAddContactOverlay() {
  let container = document.getElementById('outer-add-contact-overlay');
  container.classList.add('display-none-overlay');
}
