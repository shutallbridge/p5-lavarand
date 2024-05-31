// Select the <button data-close-dialog /> element from the DOM
const closeButton = document.querySelector("[data-close-dialog]");

// Select the <dialog data-dialog /> element from the DOM
const dialog = document.querySelector("[data-dialog]");

// The dialog should start out visible, so this needs to be invoked when this file
// runs.
dialog.show();

/**
 * Function for closing the dialog
 */
function closeDialog() {
  dialog.close();
}

// When the close button is clicked, call the `closeDialog` function.
closeButton.addEventListener("click", closeDialog);
