/**
 * Initializes the login page, loads users and login info, and checks orientation.
 */
function init() {
  getUsersFromDatabase();
  loadLoginInfo("whoIsLoggedIn");
  putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: false, userLoggedIn: { name: "", avatar: "" } });
  checkOrientation();
}

/**
 * Redirects the user to the guest summary view.
 */
function redirectToGuestView() {
  location.replace("summary/summary.html");
}

/**
 * Handles the join sign animation and overlay removal.
 */
function animationJoinSign() {
  let animationJoinSign = document.getElementById('overlay-animation');
  animationJoinSign.classList.toggle('d_none');
  initSecond();
  removeOverlayAfterAnimation();
}

/**
 * Removes the overlay after the join animation completes.
 */
function removeOverlayAfterAnimation() {
  let animationJoinSign = document.getElementById('overlay-animation');
  setTimeout(() => {
    animationJoinSign.classList.add('d_none');
  }, 2800);
}

/**
 * Speichert Login-Informationen im localStorage.
 * @param {string} key - The Key.
 * @param {any} data - The Data.
 */
function putLoginInfoLocally(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Load Login-Information at the localStorage.
 * @param {string} key - The Key.
 * @returns {any} The save Data.
 */
function loadLoginInfo(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

let userData = {};
let usersArr = [];
const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the second phase of the login process, loads users and login info.
 */
async function initSecond() {
  await getUsersFromDatabase();
  loadLoginInfo("whoIsLoggedIn");
  putLoginInfoLocally("whoIsLoggedIn", { isGuestLoggedIn: false, userLoggedIn: { name: "", avatar: "" } });
}

/**
 * Fetches all users from the database and populates usersArr.
 */
async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("user");
  let UserKeysArray = Object.keys(userResponse || {});
  for (let index = 0; index < UserKeysArray.length; index++) {
    usersArr.push({
      id: UserKeysArray[index],
      user: userResponse[UserKeysArray[index]],
    });
  }
}

/**
 * Fetches all users from the given database path.
 * @param {string} path - The database path to fetch users from.
 * @returns {Promise<Object>} The users object from the database.
 */
async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}

/**
 * Handles the login process, including validation and redirection.
 */
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

/**
 * Processes the login by checking credentials and saving login info locally.
 */
async function processLogin() {
  let loginUserEmail = document.getElementById("inputEmail").value.trim().toLowerCase();
  let filteredUser = usersArr.filter((item) => item.user.email.toLowerCase() === loginUserEmail);
  if (filteredUser.length > 0) {
    putLoginInfoLocally("whoIsLoggedIn", {
      isGuestLoggedIn: false,
      userLoggedIn: {
        name: filteredUser[0].user.name,
        avatar: filteredUser[0].user.avatar,
        email: filteredUser[0].user.email
      }
    });
  }
}

/**
 * Logs in as a guest and redirects to the summary page.
 */
function loginGuest() {
  putLoginInfoLocally("whoIsLoggedIn", { isGuestLoggedIn: true, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "./summary.html";
}

/**
 * Checks if the entered email exists in the users array.
 * @returns {boolean} True if the email exists, false otherwise.
 */
function isEmailCorrect() {
  let email = document.getElementById("inputEmail").value.trim().toLowerCase();
  return usersArr.some((user) => user.user.email.toLowerCase() === email);
}

/**
 * Checks if the entered password matches any user in the users array.
 * @returns {boolean} True if the password is correct, false otherwise.
 */
function isPasswordCorrect() {
  let password = document.getElementById("inputPassword");
  return usersArr.some((user) => user.user.password === password.value);
}

/**
 * Checks if the email or password input fields are empty.
 * @returns {boolean} True if any input is empty, false otherwise.
 */
function areInputsEmpty() {
  let email = document.getElementById("inputEmail");
  let password = document.getElementById("inputPassword");
  return email.value === "" || password.value === "";
}

/**
 * Checks if a task with the given title already exists in the array.
 * @param {Array} tasksArr - The array of tasks.
 * @param {string} title - The title to check for.
 * @returns {boolean} True if the task exists, false otherwise.
 */
function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some((task) => task.title === title);
}

/**
 * Shows required field errors for empty email or password inputs.
 */
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

/**
 * Displays an error message for a wrong password.
 */
function wrongPassword() {
  document.getElementById("wrong-password").classList.remove("dp-none");
  document.getElementById("inputPassword").style.border = "1px solid red";
}

/**
 * Displays an error message for a wrong email.
 */
function wrongEmail() {
  document.getElementById("wrong-email").classList.remove("dp-none");
  document.getElementById("inputEmail").style.border = "1px solid red";
}

/**
 * Removes error messages and resets input field styles.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} inputId - The ID of the input element.
 */

function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement && inputElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

/**
 * Redirects the user to the summary page.
 */
function goToSummary() {
  window.location.href = "./summary/summary.html";
}
window.addEventListener("load", async () => {
  await initSecond();
  const { greeting, logo, logoWhite, targetLogo, isMobile } = pullElementsForAnimation();
  if (greeting && logo && logoWhite && targetLogo) {
    requestAnimationFrame(() => {
      const { transformLogo, transformWhite } = calculateAnimation();
      setTimeoutAnimation(transformLogo, transformWhite);
    });
  }

  /**
   * Sets the transform and hide animations for the logos and greeting.
   * @param {string} transformLogo - The CSS transform for the colored logo.
   * @param {string} transformWhite - The CSS transform for the white logo.
   */
  function setTimeoutAnimation(transformLogo, transformWhite) {
    setTimeout(() => {
      logo.style.transform = transformLogo;
      logoWhite.style.transform = transformWhite;
    }, 300);
    setTimeout(() => {
      greeting.classList.add("hide");
    }, isMobile ? 700 : 1200);
  }

  /**
   * Calculates the transform values for the logo and white logo animations.
   * @returns {{transformLogo: string, transformWhite: string}} The transform CSS for both logos.
   */
  function calculateAnimation() {
    const targetRect = targetLogo.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const logoWhiteRect = logoWhite.getBoundingClientRect();
    const deltaXLogo = targetRect.left + targetRect.width / 2 - (logoRect.left + logoRect.width / 2);
    const deltaYLogo = targetRect.top + targetRect.height / 2 - (logoRect.top + logoRect.height / 2);
    const scaleLogo = targetRect.width / logoRect.width;
    const deltaXWhite = targetRect.left + targetRect.width / 2 - (logoWhiteRect.left + logoWhiteRect.width / 2);
    const deltaYWhite = targetRect.top + targetRect.height / 2 - (logoWhiteRect.top + logoWhiteRect.height / 2);
    const scaleWhite = targetRect.width / logoWhiteRect.width;
    const transformLogo = `translate(${deltaXLogo}px, ${deltaYLogo}px) scale(${scaleLogo})`;
    const transformWhite = `translate(${deltaXWhite}px, ${deltaYWhite}px) scale(${scaleWhite})`;
    return { transformLogo, transformWhite };
  }

  /**
   * Pulls and returns DOM elements needed for the greeting/logo animation.
   * @returns {{greeting: HTMLElement, logo: HTMLElement, logoWhite: HTMLElement, targetLogo: HTMLElement, isMobile: boolean}}
   */
  function pullElementsForAnimation() {
    const isMobile = window.matchMedia("(max-width: 770px)").matches;
    const greeting = document.querySelector(".greeting");
    const logo = document.querySelector(".greeting-logo");
    const logoWhite = document.querySelector(".greeting-logo-white");
    const targetLogo = document.querySelector(".join-header-logo");
    return { greeting, logo, logoWhite, targetLogo, isMobile };
  }
});

/**
 * Updates login information in the database.
 * @param {string} [path=""] - The path to update the login information in the database.
 * @param {Object} data - The data to update.
 * @returns {Promise<Object>} The updated login information.
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
};