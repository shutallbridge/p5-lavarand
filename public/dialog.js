const closeButton = document.querySelector("[data-close-dialog]");
const dialog = document.querySelector("[data-dialog]");

dialog.show();

function closeDialog() {
  dialog.close();
}

closeButton.addEventListener("click", closeDialog);
