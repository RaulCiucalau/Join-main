function initFirst(){
   animationJoinSign();
}

function redirectToGuestView() {
    location.replace("summary/summary.html");
}

function animationJoinSign(){
    let animationJoinSign = document.getElementById('overlay-animation');
    animationJoinSign.classList.toggle('d_none');
   initSecond();
   removeOverlayAfterAnimation();
}

function removeOverlayAfterAnimation() {
    let animationJoinSign = document.getElementById('overlay-animation');
    // Wait 1 second (1000 milliseconds) before adding the class
    setTimeout(() => {
        animationJoinSign.classList.add('d_none');
    }, 2800);
}

/**
 * Speichert Login-Informationen im localStorage.
 * @param {string} key - Der Schlüssel.
 * @param {any} data - Die Daten.
 */
function putLoginInfoLocally(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Lädt Login-Informationen aus dem localStorage.
 * @param {string} key - Der Schlüssel.
 * @returns {any} Die gespeicherten Daten.
 */
function loadLoginInfo(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

let userData = {};
let usersArr = [];

const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

async function initSecond() {
  console.log("init gestartet");
  await getUsersFromDatabase();
  console.log("Users geladen:", usersArr);
  loadLoginInfo("whoIsLoggedIn");
  putLoginInfoLocally("whoIsLoggedIn", { isGuestLoggedIn: false, userLoggedIn: { name: "", avatar: "" } });
}

async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("user");
  console.log("userResponse:", userResponse);
  let UserKeysArray = Object.keys(userResponse || {});
  for (let index = 0; index < UserKeysArray.length; index++) {
    usersArr.push({
      id: UserKeysArray[index],
      user: userResponse[UserKeysArray[index]],
    });
  }
  console.log("usersArr:", usersArr);
}

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}

async function loginUser() {
  if (areInputsEmpty()) {
    showRequiredFields();
  } else if (!isEmailCorrect()) {
    wrongEmail();
  } else if (!isPasswordCorrect()) {
    wrongPassword();
  } else {
    await processLogin();
    goToSummary();
  }
}

async function processLogin() {
  let loginUserEmail = document.getElementById("inputEmail").value.trim().toLowerCase();
  let filteredUser = usersArr.filter((item) => item.user.email.toLowerCase() === loginUserEmail);
  if (filteredUser.length > 0) {
    putLoginInfoLocally("whoIsLoggedIn", {
      isGuestLoggedIn: false,
      userLoggedIn: {
        name: filteredUser[0].user.name,
        avatar: filteredUser[0].user.avatar,
        email: filteredUser[0].user.email // 👈 WICHTIG!
      }
    });
  }
}


function loginGuest() {
  putLoginInfoLocally("whoIsLoggedIn", { isGuestLoggedIn: true, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "./summary.html";
}

function isEmailCorrect() {
  let email = document.getElementById("inputEmail").value.trim().toLowerCase();
  return usersArr.some((user) => user.user.email.toLowerCase() === email);
}

function isPasswordCorrect() {
  let password = document.getElementById("inputPassword");
  return usersArr.some((user) => user.user.password === password.value);
}

function areInputsEmpty() {
  let email = document.getElementById("inputEmail");
  let password = document.getElementById("inputPassword");
  return email.value === "" || password.value === "";
}

function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some((task) => task.title === title);
}

function showRequiredFields() {
  let email = document.getElementById("inputEmail");
  let password = document.getElementById("inputPassword");
  if (email.value === "") {
    document.getElementById("error-email").classList.remove("dp-none");
    document.getElementById("inputEmail").style.border = "1px solid red";
  }
  if (password.value === "") {
    document.getElementById("error-password").classList.remove("dp-none");
    document.getElementById("inputPassword").style.border = "1px solid red";
  }
}

function wrongPassword() {
  document.getElementById("wrong-password").classList.remove("dp-none");
  document.getElementById("inputPassword").style.border = "1px solid red";
}

function wrongEmail() {
  document.getElementById("wrong-email").classList.remove("dp-none");
  document.getElementById("inputEmail").style.border = "1px solid red";
}

function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement && inputElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

function goToSummary() {
  window.location.href = "/summary/summary.html";
}

window.addEventListener("load", async () => {
  await initSecond();
  const greeting = document.querySelector(".greeting");
  const logo = document.querySelector(".greeting-logo");
  const targetLogo = document.querySelector(".join-header-logo");

  if (greeting && logo && targetLogo) {
    const targetRect = targetLogo.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const deltaX = targetRect.left + targetRect.width / 2 - (logoRect.left + logoRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (logoRect.top + logoRect.height / 2);
    const scale = targetRect.width / logoRect.width;

    setTimeout(() => {
      logo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    }, 300);

    setTimeout(() => {
      greeting.classList.add("hide");
    }, 1300);
  }
});

/**
 * Optional: Wenn du die Login-Infos auch auf dem Server (Firebase) speichern willst.
 */
async function putLoginInfo(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
