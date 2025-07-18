const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

let policyAccepted = false;
let usersArr = [];

/**
 * Initializes the sign-up page, loads users, disables the signup button, and checks orientation.
 */
async function init() {
  await getUsersFromDatabase();
  disableSignupBtn();
  createRandomColor();
  checkOrientation();
}

/**
 * Fetches all users from the given database path.
 * @param {string} path - The database path to fetch users from.
 * @returns {Promise<Object>} The users object from the database.
 */
async function getAllUsers(path) {
  let response = await fetch(`${BASE_URL}${path}.json`);
  return await response.json();
}

/**
 * Fetches all users from the database and populates usersArr.
 */
async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("user");

  if (!userResponse) {
    userResponse = {};
  }

  let UserKeysArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeysArray.length; index++) {
    usersArr.push({
      id: UserKeysArray[index],
      user: userResponse[UserKeysArray[index]],
    });
  }
}

/**
 * Creates a new user object with the given email, password, and name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} name - The user's name.
 * @returns {Object} The new user object.
 */
function createNewUser(email, password, name) {
  return {
    id: generateUniqueId(),
    user: {
      color: createRandomColor(),
      email,
      name,
      password,
      avatar: createAvatar(name),
      phoneNumber: "",
    },
  };
}

/**
 * Generates a unique ID based on the current timestamp.
 * @returns {string} The unique ID.
 */
function generateUniqueId() {
  return String(Date.now());
}

/**
 * Creates an avatar string from the capital letters in the name.
 * @param {string} str - The user's name.
 * @returns {string} The avatar string.
 */
function createAvatar(str) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[A-Z]/)) {
      newStr += str[i];
    }
  }
  return newStr;
}

/**
 * Generates a random RGB color string.
 * @returns {string} The random color string.
 */
function createRandomColor() {
  let r = Math.floor(Math.random() * 255) + 1;
  let g = Math.floor(Math.random() * 255) + 1;
  let b = Math.floor(Math.random() * 255) + 1;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Enables the signup button and adds the enabled class.
 */
function enableSignupBtn() {
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("submit-btn").classList.add("signup-btn-enabled");
}

/**
 * Disables the signup button and removes the enabled class.
 */
function disableSignupBtn() {
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("submit-btn").classList.remove("signup-btn-enabled");
}

/**
 * Handles the acceptance of the privacy policy and toggles the signup button.
 */
function acceptPolicy() {
  if (!policyAccepted) {
    document.getElementById("checkbox").src = "./assets/icons/btn-checked-blue.svg";
    policyAccepted = true;
    enableSignupBtn();
  } else {
    document.getElementById("checkbox").src = "./assets/icons/btn-unchecked.svg";
    policyAccepted = false;
    disableSignupBtn();
  }
}

/**
 * Adds or edits a single user in the database.
 * @param {string} id - The user ID.
 * @param {Object} user - The user data.
 * @returns {Promise<void>}
 */
async function addEditSingleUser(id, user) {
  await putData(`user/${id}`, user);
}

/**
 * Updates data in the database at the given path.
 * @param {string} [path=""] - The path to update in the database.
 * @param {Object} data - The data to update.
 * @returns {Promise<Object>} The updated data.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}${path}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Handles the sign-up form submission and validation.
 * @param {Event} event - The form submit event.
 */
async function signUp(event) {
  event.preventDefault();
  const emailEl = document.getElementById("email");
  const nameEl = document.getElementById("name");
  const email = emailEl.value;
  const name = nameEl.value;

  if (handleEmptyInputs()) return;
  if (handleInvalidEmail(emailEl)) return;
  if (handleExistingEmail(email, emailEl)) return;
  if (handleExistingUser(email, name, nameEl)) return;
  if (handlePasswordMismatch()) return;

  completeSignUp();
}

/**
 * Adds a new user from the form inputs and saves to the database.
 */
function addUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const newUser = createNewUser(email, password, name);
  usersArr.push(newUser);
  saveUserToDatabase(newUser);
}

/**
 * Saves a user to the database and creates a contact for the user.
 * @param {Object} user - The user object to save.
 */
function saveUserToDatabase(user) {
  const { id, user: userData } = user;
  addEditSingleUser(id, userData);
}

/**
 * Completes the sign-up process, shows a log, and redirects to login.
 */
function completeSignUp() {
  addUser();
  showLog();
  goToLogin();
}

/**
 * Displays a sign-up successful message.
 */
function showLog() {
  document.getElementById("log").innerHTML = `<div class="signup-successful-msg">
    <p>You Signed Up Successfully</p> 
  </div>`;
}

/**
 * Redirects to the login page after a short delay.
 */
function goToLogin() {
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 1000);
}

/**
 * Checks if the users array is empty and logs a warning if so.
 * @returns {boolean} Always returns false.
 */
function isUsersArrEmpty() {
  if (usersArr.length === 0) {
    console.warn("No users found yet. Proceeding anyway...");
  }
  return false;
}

/**
 * Handles empty input fields and shows required field errors.
 * @returns {boolean} True if any input is empty, false otherwise.
 */
function handleEmptyInputs() {
  if (areInputsEmpty()) {
    showRequiredFields();
    return true;
  }
  return false;
}

/**
 * Checks if any of the sign-up input fields are empty.
 * @returns {boolean} True if any input is empty, false otherwise.
 */
function areInputsEmpty() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let name = document.getElementById("name").value;
  return email === "" || password === "" || name === "";
}

/**
 * Shows required field errors for empty sign-up inputs.
 */
function showRequiredFields() {
  checkAndShowError("name", "error-name");
  checkAndShowError("email", "error-email-1");
  checkAndShowError("password", "error-pw");
  checkAndShowError("confirm-password", "error-confirm-pw");
}

/**
 * Checks if an input is empty and shows the corresponding error message.
 * @param {string} inputId - The input element ID.
 * @param {string} errorId - The error message element ID.
 */
function checkAndShowError(inputId, errorId) {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);

  if (inputElement.value.trim() === "") {

    inputElement.style.borderColor = "red";
    errorElement.classList.remove("dp-none");
  }
}

/**
 * Handles invalid email input and shows an error if invalid.
 * @param {HTMLElement} emailEl - The email input element.
 * @returns {boolean} True if invalid, false otherwise.
 */
function handleInvalidEmail(emailEl) {
  if (!validateEmail(emailEl.value)) {
    document.getElementById("error-email-2").classList.remove("dp-none");
    emailEl.style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Validates an email address using a regex pattern.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Handles the case where the email already exists and shows an error.
 * @param {string} emailVal - The email value to check.
 * @param {HTMLElement} emailEl - The email input element.
 * @returns {boolean} True if exists, false otherwise.
 */
function handleExistingEmail(emailVal, emailEl) {
  if (emailAlreadyExists(usersArr, emailVal)) {
    document.getElementById("error-email-3").classList.remove("dp-none");
    emailEl.style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Checks if the email already exists in the users array.
 * @param {Array} usersArr - The array of users.
 * @param {string} email - The email to check.
 * @returns {boolean} True if exists, false otherwise.
 */
function emailAlreadyExists(usersArr, email) {
  return usersArr.some((user) => user.user.email === email);
}

/**
 * Handles the case where the user already exists and shows an error.
 * @param {string} emailVal - The email value to check.
 * @param {string} nameVal - The name value to check.
 * @param {HTMLElement} nameEl - The name input element.
 * @returns {boolean} True if exists, false otherwise.
 */
function handleExistingUser(emailVal, nameVal, nameEl) {
  if (userAlreadyExists(usersArr, emailVal, nameVal)) {
    document.getElementById("error-name-2").classList.remove("dp-none");
    nameEl.style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Checks if a user with the given email or name already exists.
 * @param {Array} usersArr - The array of users.
 * @param {string} email - The email to check.
 * @param {string} name - The name to check.
 * @returns {boolean} True if exists, false otherwise.
 */
function userAlreadyExists(usersArr, email, name) {
  return usersArr.some((user) => user.user.email === email || user.user.name === name);
}

/**
 * Handles the case where the passwords do not match and shows an error.
 * @returns {boolean} True if mismatch, false otherwise.
 */
function handlePasswordMismatch() {
  if (!passwordsMatch()) {
    document.getElementById("error-confirm-pw").classList.remove("dp-none");
    document.getElementById("password").style.borderColor = "red";
    document.getElementById("confirm-password").style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Checks if the password and confirm password fields match.
 * @returns {boolean} True if they match, false otherwise.
 */
function passwordsMatch() {
  return document.getElementById("password").value === document.getElementById("confirm-password").value;
}

/**
 * Removes error messages and resets input field styles.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} inputId - The ID of the input element.
 */
function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

/**
 * Creates a contact entry in the database for the given user.
 * @param {{name: string, email: string, avatar: string, color: string}} userData
 */
async function createContactForUser(userData) {
  const contact = {
    name: userData.name,
    e_mail: userData.email,
    phone: "",
    avatar: userData.avatar,
    color: userData.color,
  };
  await fetch(`${BASE_URL}contacts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
}

function saveUserToDatabase(user) {
  const { id, user: userData } = user;
  addEditSingleUser(id, userData); 
  createContactForUser(userData);  
}
