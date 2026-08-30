const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

function showToast(id) {
  const toast = document.getElementById(id);
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

document.getElementById("form-turno").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("toast-turno");
});

document.getElementById("form-cuenta").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("toast-cuenta");
});

document.getElementById("form-login-footer").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("tab-cuenta").click();
  showToast("toast-cuenta");
});
