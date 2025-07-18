/**
 * Loads login information from localStorage.
 * @param {string} key - The key to retrieve from localStorage.
 * @returns {Object|null} The parsed login info or null if not found.
 */
function loadLoginInfo(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

window.BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads the avatar for the header based on the logged-in user.
 * Sets the initial letter or avatar in the header.
 * @returns {Promise<void>}
 */
async function loadAvatarForHeader() {
  const loginInfo = loadLoginInfo("whoIsLoggedIn")
  if (!loginInfo || !loginInfo.userLoggedIn || !loginInfo.userLoggedIn.email) {
    document.getElementById("initialLetter").innerText = "G";
    return;
  }
  const email = loginInfo.userLoggedIn.email;
  try {
    await foundUser(email);
  } catch (error) {
    showError(error);
  }
  document.addEventListener("DOMContentLoaded", () => {
  waitForInitialLetterElement(loadAvatarForHeader);
});

  /**
   * Finds the user by email and sets the avatar or initial letter.
   * @param {string} email - The user's email address.
   * @returns {Promise<void>}
   */
  async function foundUser(email) {
    const response = await fetch(`${BASE_URL}user.json`);
    const data = await response.json();
    const user = Object.values(data).find(
      (userObj) => userObj.email.toLowerCase() === email.toLowerCase()
    );
    if (user && user.avatar) {
      document.getElementById("initialLetter").innerText = user.avatar;
    } else if (user && user.name) {
      document.getElementById("initialLetter").innerText = user.name[0].toUpperCase();
    } else {
      document.getElementById("initialLetter").innerText = "?";
    }
  }
}

  /**
   * Displays an error message when loading the avatar fails.
   * @param {Error} error - The error object.
   */
  function showError(error) {
    console.error("❌ Fehler beim Avatar-Laden:", error);
    document.getElementById("initialLetter").innerText = "?";
  }

/**
 * Waits for the 'initialLetter' element to appear in the DOM, then calls the callback.
 * @param {Function} callback - The function to call when the element is found.
 */
function waitForInitialLetterElement(callback) {
  const observer = new MutationObserver(() => {
    const element = document.getElementById("initialLetter");
    if (element) {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Shows or hides the submenu for a logged-in user.
 */
function showSubMenuLoggedIn() {
  if (document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.remove("dp-none");
    document.getElementById("subMenu").innerHTML = `
                      <a href="/privacy_policy.html"><div class="subMenu-btns">Privacy Policy</div></a>
                      <a href="/legal_notice.html"><div class="subMenu-btns">Legal Notice</div></a>
                      <div onclick="logOut()" class="subMenu-btns">Log Out</div>`;
  } else {
    closeSubMenu();
  }
}

/**
 * Closes the submenu with an animation.
 */
function closeSubMenu() {
  const subMenu = document.getElementById("subMenu");
  if (subMenu.classList.contains("dp-none")) return;
  subMenu.classList.add("slide-out");
  subMenu.addEventListener("animationend", function handleAnimationEnd() {
    subMenu.classList.remove("slide-out");
    subMenu.classList.add("dp-none");
    subMenu.removeEventListener("animationend", handleAnimationEnd);
  });
}

/**
 * Logs out the current user and redirects to the login page.
 * @returns {Promise<void>}
 */
async function logOut() {
  await putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: false, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "/index.html";
}

/**
 * Updates login information in the database.
 * @param {string} [path=""] - The path to update the login information in the database.
 * @param {Object} data - The data to update.
 * @returns {Object} - The updated login information.
 */

async function putLoginInfo(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Prevents event bubbling.
 * @param {Event} event - The event to stop propagation.
 */

function preventBubbling(event) {
  event.stopPropagation();
}