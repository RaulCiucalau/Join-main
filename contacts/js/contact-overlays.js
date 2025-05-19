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
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("new-email").value;
  const phone = document.getElementById("new-phone").value;

  if (!name || !email || !phone) {
    alert("Bitte alle Felder ausfüllen.");
    return;
  }

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
