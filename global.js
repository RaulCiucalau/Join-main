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
  console.log("🔎 Starte Avatar-Ladefunktion...");

  const loginInfo = loadLoginInfo("whoIsLoggedIn");
  console.log("📦 loginInfo:", loginInfo);

  if (!loginInfo || !loginInfo.userLoggedIn || !loginInfo.userLoggedIn.email) {
    console.warn("⚠️ Kein eingeloggter Nutzer gefunden.");
    document.getElementById("initialLetter").innerText = "?";
    return;
  }

  const email = loginInfo.userLoggedIn.email;

  try {
    const response = await fetch(`${BASE_URL}user.json`);
    const data = await response.json();
    console.log("🌐 Daten aus DB:", data);

    const user = Object.values(data).find(
      (userObj) => userObj.email.toLowerCase() === email.toLowerCase()
    );

    if (user && user.avatar) {
      console.log("✅ Avatar gefunden:", user.avatar);
      document.getElementById("initialLetter").innerText = user.avatar;
    } else if (user && user.name) {
      console.log("🟨 Kein Avatar in DB, nutze 1. Buchstaben:", user.name[0].toUpperCase());
      document.getElementById("initialLetter").innerText = user.name[0].toUpperCase();
    } else {
      console.warn("❌ Nutzer nicht gefunden oder ohne Avatar/Name.");
      document.getElementById("initialLetter").innerText = "?";
    }

  } catch (error) {
    console.error("❌ Fehler beim Avatar-Laden:", error);
    document.getElementById("initialLetter").innerText = "?";
  }
}

window.onload = () => {
  loadAvatarForHeader();
};

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





