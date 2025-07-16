const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

let policyAccepted = false;
let usersArr = [];

async function init() {
  await getUsersFromDatabase();
  disableSignupBtn();
  createRandomColor();
  checkOrientation();
}

async function getAllUsers(path) {
  let response = await fetch(`${BASE_URL}${path}.json`);
  return await response.json();
}

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

function generateUniqueId() {
  return String(Date.now());
}

function createAvatar(str) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[A-Z]/)) {
      newStr += str[i];
    }
  }
  return newStr;
}

function createRandomColor() {
  let r = Math.floor(Math.random() * 255) + 1;
  let g = Math.floor(Math.random() * 255) + 1;
  let b = Math.floor(Math.random() * 255) + 1;
  return `rgb(${r}, ${g}, ${b})`;
}

function enableSignupBtn() {
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("submit-btn").classList.add("signup-btn-enabled");
}

function disableSignupBtn() {
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("submit-btn").classList.remove("signup-btn-enabled");
}

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

async function addEditSingleUser(id, user) {
  await putData(`user/${id}`, user);
}

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

function addUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const newUser = createNewUser(email, password, name);
  usersArr.push(newUser);
  saveUserToDatabase(newUser);
}

function saveUserToDatabase(user) {
  const { id, user: userData } = user;
  addEditSingleUser(id, userData);
}

function completeSignUp() {
  addUser();
  showLog();
  goToLogin();
}

function showLog() {
  document.getElementById("log").innerHTML = `<div class="signup-successful-msg">
    <p>You Signed Up Successfully</p> 
  </div>`;
}

function goToLogin() {
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 1000);
}

function isUsersArrEmpty() {
  if (usersArr.length === 0) {
    console.warn("No users found yet. Proceeding anyway...");
  }
  return false;
}

function handleEmptyInputs() {
  if (areInputsEmpty()) {
    showRequiredFields();
    return true;
  }
  return false;
}

function areInputsEmpty() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let name = document.getElementById("name").value;
  return email === "" || password === "" || name === "";
}

function showRequiredFields() {
  checkAndShowError("name", "error-name");
  checkAndShowError("email", "error-email-1");
  checkAndShowError("password", "error-pw");
  checkAndShowError("confirm-password", "error-confirm-pw");
}

function checkAndShowError(inputId, errorId) {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);

  if (inputElement.value.trim() === "") {

    inputElement.style.borderColor = "red";
    errorElement.classList.remove("dp-none");
  }
}

function handleInvalidEmail(emailEl) {
  if (!validateEmail(emailEl.value)) {
    document.getElementById("error-email-2").classList.remove("dp-none");
    emailEl.style.borderColor = "red";
    return true;
  }
  return false;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function handleExistingEmail(emailVal, emailEl) {
  if (emailAlreadyExists(usersArr, emailVal)) {
    document.getElementById("error-email-3").classList.remove("dp-none");
    emailEl.style.borderColor = "red";
    return true;
  }
  return false;
}

function emailAlreadyExists(usersArr, email) {
  return usersArr.some((user) => user.user.email === email);
}

function handleExistingUser(emailVal, nameVal, nameEl) {
  if (userAlreadyExists(usersArr, emailVal, nameVal)) {
    document.getElementById("error-name-2").classList.remove("dp-none");
    nameEl.style.borderColor = "red";
    return true;
  }
  return false;
}

function userAlreadyExists(usersArr, email, name) {
  return usersArr.some((user) => user.user.email === email || user.user.name === name);
}

function handlePasswordMismatch() {
  if (!passwordsMatch()) {
    document.getElementById("error-confirm-pw").classList.remove("dp-none");
    document.getElementById("password").style.borderColor = "red";
    document.getElementById("confirm-password").style.borderColor = "red";
    return true;
  }
  return false;
}

function passwordsMatch() {
  return document.getElementById("password").value === document.getElementById("confirm-password").value;
}

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
