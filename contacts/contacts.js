const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";
const USERS_PATH = "contacts/";

/**
 * Constructs the full URL to access user data in Firebase.
 * @param {string} [key=""] - Optional key for a specific user.
 * @returns {string} The full Firebase URL.
 */
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

/**
 * Fetches contacts from Firebase and initializes the contacts list.
 * @returns {Promise<void>}
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
 * Initializes the contacts page, loads contacts, hides details, and checks orientation.
 */
async function init() {
  await contactFirebase();
  rightContactDetailsHideOnLoad();
  checkOrientation();
}

/**
 * Renders the left column with contact initials and contact list.
 */
function renderLeftColumnContacts() {
  contactList();
  let validUserKeys = Object.keys(users).filter(key => {
    const u = users[key];
    return u && typeof u === 'object' && typeof u.name === 'string' && u.name.trim() !== '';
  });
  let lastInitial = "";
  let sortedUserKeys = validUserKeys.sort((a, b) => {
    const nameA = users[a].name;
    const nameB = users[b].name;
    return nameA.localeCompare(nameB);
  });
  sortedUserKeys.forEach((keyObj, indexOfUser) => {
    let { initial, user } = firstLettersBig(keyObj);
    if (initial !== lastInitial) {
      renderLeftColumn(initial);
    }
    renderLeftColumnPartTwo(user, indexOfUser, keyObj);
    makeLeftContactActive();
  });

  /**
   * Clears the left contacts list and updates users from fireBase.
   */
  function contactList() {
    leftContactsList.innerHTML = "";
    users = fireBase.users;
  }

  /**
   * Returns the initial letter and user object for a given key.
   * @param {string} keyObj - The user key.
   * @returns {{initial: string, user: object}}
   */
  function firstLettersBig(keyObj) {
    let user = users[keyObj];
    let initial = user.name.charAt(0).toUpperCase();
    return { initial, user };
  }

  /**
   * Renders the initial letter section in the left column.
   * @param {string} initial - The initial letter.
   */
  function renderLeftColumn(initial) {
    leftContactsList.innerHTML += renderLeftColumnContactsInitalsTemplate(initial);
    lastInitial = initial;
  }
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
 * Hides the right contact details area on page load.
 */
function rightContactDetailsHideOnLoad() {
  contactDetailsArea = document.getElementById("contact-details-area");
  contactDetailsArea.classList.add("hide");
}

/**
 * Sets the large initials for the detailed contact view.
 * @param {object} user - User data object.
 */
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
 * Hides the contact details and shows the left column.
 * @param {object} users - Users object.
 */
function hideContactDetails(users) {
  let rightColumn = document.getElementById("right-contacts-page-column");
  let leftColumn = document.getElementById("left-contacts-page-column");
  rightColumn.style.display = "none";
  leftColumn.style.display = "block";
}

/**
 * Adds click event listeners to contact list items to set them active.
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
 * Renders the right contact details area for a selected contact.
 * @param {string} name - Contact name.
 * @param {string} email - Contact email.
 * @param {string} phone - Contact phone.
 * @param {string} paramKey - Firebase key.
 * @param {object} users - Users object.
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
 * Handles responsive view for contact details on small screens.
 * @param {string} paramKey - Firebase key.
 * @param {object} users - Users object.
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
 * Handles the overlay button for contact details in responsive view.
 * @param {string} paramKey - Firebase key.
 * @param {object} users - Users object.
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
 * Updates the contact details area with the selected contact's info.
 * @param {string} name - Contact name.
 * @param {string} email - Contact email.
 * @param {string} phone - Contact phone.
 * @param {string} paramKey - Firebase key.
 * @param {object} users - Users object.
 */
function updateContactDetails(name, email, phone, paramKey, users) {
  contactDetailsAreaTemplate(paramKey, users);
  document.getElementById("big-user-name").innerText = name;
  let rightEmailArea = document.getElementById("user-email");
  rightEmailArea.innerHTML = `${email}`;
  rightEmailArea.href = `mailto:${email}`;
  document.getElementById("user-phone-number").innerText = phone;
  document.getElementById("contact-to-trash").onclick = () =>
    deleteContactFromDatabase(paramKey, users);
  document.getElementById("contact-edit").onclick = () =>
    editContact(paramKey, users);
}

/**
 * Updates the user details area with initials and color.
 * @param {string} paramKey - Firebase key.
 * @param {object} users - Users object.
 */
function updateUserDetails(paramKey, users) {
  let user = users[paramKey];
  createBigContactNameInitials(user);
  bigRandomColour(user);
}

/**
 * Deletes a contact from the database and updates the UI.
 * @param {string} key - Firebase key.
 * @param {object} users - Users object.
 * @returns {Promise<void>}
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
 * Opens the edit contact overlay for a given contact.
 * @param {string} paramKey - Firebase key.
 * @param {object} users - Users object.
 */
function editContact(paramKey, users) {
  editContactOverlay(paramKey, users);
}

/**
 * Stops event propagation.
 * @param {Event} event - The event to stop propagation for.
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Displays the phone number for a user in the UI.
 * @param {object} user - User data object.
 */
function displayPhoneNumber(user) {
  document.getElementById("user-phone-number").innerText = user.phone;
}

/**
 * Applies random colors to user initials avatars in the contact list.
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
 * Sets the background color for the big initials area in the contact details.
 * @param {object} user - User data object.
 */
function bigRandomColour(user) {
  let bigInitialsArea = document.getElementById("user-picture-big-index");
  if (bigInitialsArea && user.color) {
    bigInitialsArea.style.backgroundColor = user.color;
  }
}