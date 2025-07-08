function renderLeftColumnContactsTemplate(user, indexOfUser, key) {
  if (!user) return;
  const name = user.name || "Unbekannt";
  const email = user.e_mail || "—";
  const phone = user.phone || "—";

  leftContactsList.innerHTML += `
    <div
      class="contact-list"
      onclick='renderRightContactArea("${name}", "${email}", "${phone}", "${key}", users)'
      id="user${indexOfUser}"
    >
      <div class="user-area">
        <div class="user-picture">
          <div
            id="user-icon${indexOfUser}"
            class="user-initials user-icon"
          ></div>
        </div>
        <div class="user-info">
          <p class="user-name">${name}</p>
          <p class="user-email">${email}</p>
        </div>
      </div>
    </div>`;
}



function contactDetailsAreaTemplate(paramKey, users) {
  let contactDetailsArea = document.getElementById("contact-details-area");
  contactDetailsArea.classList.add("show");
  contactDetailsArea.innerHTML = `            
              <div class="user-name-header">
                <div id="user-picture-big-index" class="user-picture-big">
                </div>
                <div class="user-name-area">
                  <div id="big-user-name" class="big-user-name">User Name</div>
                  <div id="user-name-options" class="user-name-options">
                    <a
                      id="contact-edit"
                      onclick="editContactOverlay('${paramKey}', users)"
                      class="edit-options"
                      ><img
                        class="option-icon"
                        src="/assets/icons/edit-icon.svg"
                      />
                      <div class="text-option-icon">Edit</div></a
                    >
                    <a
                      id="contact-to-trash"
                      class="edit-options"
                      onclick="deleteContactFromDatabase('${paramKey}', users)"
                      ><img
                        class="option-icon"
                        src="/assets/icons/trash-icon.svg"
                      />
                      <div class="text-option-icon">Delete</div></a
                    >
                  </div>
                </div>
              </div>
              <h3 class="contact-information">Contact Information</h3>
              <div class="contact-details">
                <h4>E-Mail</h4>
                <br />
                <a id="user-email" class="user-email">user@name.com</a>
                <h4 class="phone-number">Phone</h4>
                <br />
                <p id="user-phone-number" class="user-phone-number"></p>
                <br />
              </div>
            </div>`;
}

function displayAddContactOverlay()
{
  let overlayBody = document.getElementById('overlayArea'); 
  let realBody = document.getElementById('body');
   overlayBody.innerHTML = '';
  overlayBody.innerHTML += `
      <div onclick="closeAddContactOverlay()" id="outer-add-contact-overlay">
        <div onclick="stopPropagation(event)" id="add-contact-overlay">
          <div id="left-add-contact-column">
            <div id="add-contact-header-area">
              <img id="overlay-join-logo" src="/assets/icons/Capa 2.svg" alt="" />
              <h1 id="add-contact-heading">Add contact</h1>
              <h2>Tasks are better with a team!</h2>
            </div>
            <div><button id="closeOverlayButton" onclick="closeOverlay()">X</button></div>
          </div>
          <div id="right-add-contact-column">
            <div class="new-contact-icon">
              <img src="/assets/icons/new-contact-icon.svg" alt="" />
            </div>
            <div id="add-contact-options">
              <form id="addContactForm" class="add-contact-form" onsubmit="return validateAndSubmitForm(event)">
                <div class="input-group">
                  <input type="text" id="fullName" placeholder="Name" />
                  <img class="icon" src="/assets/icons/person.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input id="new-email" placeholder="E-Mail" />
                  <img class="icon" src="/assets/icons/mail.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input type="tel" id="new-phone" placeholder="Phone" />
                  <img class="icon" src="/assets/icons/call.svg">
                  <small class="error-message"></small>
                </div>
                <div class="create-contact-btn" id="button-area">
                  <button type="button" onclick="closeOverlay()" id="cancel-add-contact" class="add-contacts-overlay-btns">
                    Cancel X
                  </button>
                  <button type="button" onclick="getOverlayData()" id="create-contact" class="add-contacts-overlay-btns">
                    Create contact ✓
                  </button>
                </div>
                 <div id="form-error-msg" class="form-error-msg hide">Bitte alle Felder ausfüllen.</div>
              </form>
            </div>
          </div>
        </div>
      </div>`;
}

function editContactOverlay(key, users)
{
  let user = users[key];
  let overlayBody = document.getElementById('overlayArea'); 
  overlayBody.innerHTML = `
      <div onclick="closeEditOverlay()" class="" id="outer-edit-contact-overlay">
        <div onclick="stopPropagation(event)" id="edit-contact-overlay">
          <div id="left-edit-contact-column" onclick="stopPropagation(event)">
            <button id="closeEditOverlay" onclick="closeEditOverlay()">X</button>
            <h1 id="edit-contact-heading">Edit contact</h1>
            <img id="overlay-join-logo" src="/assets/icons/Capa 2.svg" alt="" />
          </div>
          <div id="right-edit-contact-column">
            <div class="new-contact-icon">
              <img src="/assets/icons/new-contact-icon.svg"/>
            </div>
            <div id="edit-contact-options">
              <form id="editContactForm" data-key="${key}" class="edit-contact-form" onsubmit="return validateAndSubmitForm(event)">
                <div class="input-group">
                  <input type="text" id="fullName" value="${user.name}" placeholder="Name" />
                  <img class="icon" src="/assets/icons/person.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input id="new-email" value="${user.e_mail}" placeholder="E-Mail" />
                  <img class="icon" src="/assets/icons/mail.svg">
                  <small class="error-message"></small>
                </div>
                <div class="input-group">
                  <input type="tel" id="new-phone" value="${user.phone}" placeholder="Phone" />
                  <img class="icon" src="/assets/icons/call.svg">
                  <small class="error-message"></small>
                </div>
                <div id="button-area">
                  <button type="button" onclick="deleteContactFromDatabase('${key}', users)" id="cancel-edit-contact" class="edit-contacts-overlay-btns">
                    Delete
                  </button>
                  <button type="button" onclick="saveEditedContact('${key}')", users)" class="edit-contacts-overlay-btns">
                    Save ✓
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>`;
}
