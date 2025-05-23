/**
 * Array of predefined categories.
 * @type {string[]}
 */
let category = ["Technical Task", "User Story"];

/**
 * Toggles the visibility of the category dropdown list.
 * @param {Event} event - The event object to stop propagation.
 */
function showCategoryList(event) {
  event.stopPropagation();
  if (document.getElementById("add-category-img-up").classList.contains("dp-none")) {
    document.getElementById("add-category-img-up").classList.remove("dp-none");
    document.getElementById("add-category-img-down").classList.add("dp-none");
    document.getElementById("drop-down-category-list").classList.remove("dp-none");
    renderCategoryList();
  } else {
    closeCategoryList();
  }
  closeContactList();
}

/**
 * Renders the category dropdown list by populating it with category items.
 */
function renderCategoryList() {
  document.getElementById("drop-down-category-list").innerHTML = "";
  for (let i = 0; i < category.length; i++) {
    document.getElementById("drop-down-category-list").innerHTML += categoryDropDownTemplate(i);
  }
}

/**
 * Generates the HTML template for a category dropdown item.
 * @param {number} indexCategory - The index of the category in the array.
 * @returns {string} - The HTML string for the category dropdown item.
 */
function categoryDropDownTemplate(indexCategory) {
  return `<div class="categoryListElement" onclick="selectCategory(${indexCategory})">
            <span class="category">${category[indexCategory]}</span>
            </div>`;
}

/**
 * Selects a category from the dropdown list and sets it as the input value.
 * @param {number} i - The index of the selected category in the array.
 */
function selectCategory(i) {
  document.getElementById("category").value = category[i];
  closeCategoryList();
}

/**
 * Closes the category dropdown list and resets its visibility state.
 */
function closeCategoryList() {
  document.getElementById("drop-down-category-list").classList.add("dp-none");
  document.getElementById("add-category-img-up").classList.add("dp-none");
  document.getElementById("add-category-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-category-list").innerHTML = "";
}
