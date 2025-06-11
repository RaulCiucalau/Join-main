function contactListDropDownTemplate(i) {
  return `<div class="contactListElement" id="${i}" onclick="toggleContactSelection(${i})">
              <div class="contact">
              <span class="avatar" style="background-color: ${contacts[i].color}">${contacts[i].avatar}</span>
              <span>${contacts[i].name}</span>
              </div>
              <div><img id="btn-checkbox-${i}" src="../assets/icons/btn-unchecked.svg" alt="Button Unchecked"/></div>
              </div>`;
}