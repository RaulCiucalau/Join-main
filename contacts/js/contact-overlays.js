function closeOverlay()
{
    let overlay = document.getElementById('outer-add-contact-overlay');
    overlay.remove(); 
}

document.body.addEventListener("click", function (e) {
  if (e.target && e.target.id === "create-contact") {
    e.preventDefault();
    getOverlayData();
  }
});


function getOverlayData() {
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("new-email");
  const phoneInput = document.getElementById("new-phone");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorBox = document.getElementById("form-error-msg");
  const nameError = nameInput.closest(".input-group").querySelector(".error-message");
  const emailError = emailInput.closest(".input-group").querySelector(".error-message");
  const phoneError = phoneInput.closest(".input-group").querySelector(".error-message");

  // Alle Fehlermeldungen zurücksetzen
  errorBox.classList.add("hide");
  nameError.innerText = "";
  emailError.innerText = "";
  phoneError.innerText = "";

  let valid = true;

  // Einzelfeld-Validierung
  if (!name) {
    nameError.innerText = "Bitte Name eingeben.";
    valid = false;
  } else if (/\d/.test(name)) {
    nameError.innerText = "Name darf keine Zahlen enthalten.";
    valid = false;
  }

  if (!email) {
    emailError.innerText = "Bitte E-Mail eingeben.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.innerText = "Ungültige E-Mail-Adresse.";
    valid = false;
  }

  if (!phone) {
    phoneError.innerText = "Bitte Telefonnummer eingeben.";
    valid = false;
  } else if (!/^\d+$/.test(phone)) {
    phoneError.innerText = "Telefonnummer darf nur Zahlen enthalten.";
    valid = false;
  }

  if (!valid) {
    errorBox.classList.remove("hide");
    return;
  }

  // ✅ Wenn alles gültig: absenden
  addNewContactToDatabase(name, email, phone);
}



function contactsuccessfullyDeletedNotification() {
  let displayArea = document.getElementById("contact-details-area");
  displayArea.innerHTML = `<div class="success-notifications" id="success-notification">Contact was successfully deleted.</div>`;
  if (window.innerWidth < 1250) {
    setTimeout(function () {
      window.location.reload();
    }, 2000);
  }
}
