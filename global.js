// Holt Daten aus dem localStorage
function loadLoginInfo(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

window.BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Holt den Avatar des eingeloggten Users aus der DB und zeigt ihn im Header.
 */
async function loadAvatarForHeader() {
  const loginInfo = loadLoginInfo("whoIsLoggedIn");
  if (!loginInfo || !loginInfo.userLoggedIn || !loginInfo.userLoggedIn.email) {
    document.getElementById("initialLetter").innerText = "?";
    return;
  }
  const email = loginInfo.userLoggedIn.email;
  try {
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

  } catch (error) {
    console.error("❌ Fehler beim Avatar-Laden:", error);
    document.getElementById("initialLetter").innerText = "?";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  waitForInitialLetterElement(loadAvatarForHeader);
});

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


function showSubMenuLoggedIn() {
  if (document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.remove("dp-none");
    document.getElementById("subMenu").innerHTML = `
                      <a href="/privacy_policy.html"><div class="subMenu-btns">Privacy Policy</div></a>
                      <a href="/legal_notice.html"><div class="subMenu-btns">Legal Notice</div></a>
                      <div onclick="logOut()" class="subMenu-btns">Log Out</div>`;
  } else {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

/**
 * Closes the logged-in submenu if it is visible.
 */
function closeSubMenu() {
  if (!document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

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





