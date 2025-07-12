function isNameValid(inputId) {
  const input = document.getElementById(inputId);
  const nameValue = input.value.trim();
  hideInputError(inputId);

  if (!nameValue || /\d/.test(nameValue)) {
    showInputError(inputId);
    return false;
  }
  return true;
}

function isEmailValid(inputId) {
  const input = document.getElementById(inputId);
  const emailValue = input.value.trim();
  hideInputError(inputId);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValue || !emailPattern.test(emailValue)) {
    showInputError(inputId);
    return false;
  }
  return true;
}

function isPhoneValid(inputId) {
  const input = document.getElementById(inputId);
  const phoneValue = input.value.trim();
  hideInputError(inputId);

  if (!phoneValue || !/^\d+$/.test(phoneValue)) {
    showInputError(inputId);
    return false;
  }
  return true;
}


function showInputError(inputId) {
  const errorElement = document.getElementById(`${inputId}-error`);
  if (errorElement) errorElement.classList.remove("hidden");
}

function hideInputError(inputId) {
  const errorElement = document.getElementById(`${inputId}-error`);
  if (errorElement) errorElement.classList.add("hidden");
}