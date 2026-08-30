function showToast(id) {
  const toast = document.getElementById(id);
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

const formTurno = document.getElementById("form-turno");
if (formTurno) {
  formTurno.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("toast-turno");
  });
}

const formCuenta = document.getElementById("form-cuenta");
if (formCuenta) {
  formCuenta.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("toast-cuenta");
  });
}
