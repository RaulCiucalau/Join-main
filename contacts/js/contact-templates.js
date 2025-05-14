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
                  Userimage
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
                      Edit</a
                    >
                    <a
                      id="contact-to-trash"
                      class="edit-options"
                      onclick="deleteContactFromDatabase('${paramKey}', users)"
                      ><img
                        class="option-icon"
                        src="/assets/icons/trash-icon.svg"
                      />
                      Delete</a
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
