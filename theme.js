const THEME_KEY = "mar_theme_v2";
const AUTH_KEY = "mar_auth";

const DEFAULT_THEME = {
  bg: "#e7eee3",
  card: "#ffffff",
  btn1: "#2c4a38",
  btn2: "#ffffff",
  login: "#dce7d4",
  font: '"Nunito", sans-serif',
  logoX: 50,
  logoY: 50,
  logoSize: 210
};

function getTheme() {
  try {
    return { ...DEFAULT_THEME, ...(JSON.parse(localStorage.getItem(THEME_KEY)) || {}) };
  } catch {
    return { ...DEFAULT_THEME };
  }
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  applyTheme(theme);
}

function applyTheme(theme) {
  const t = theme || getTheme();
  const root = document.documentElement;
  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--card", t.card);
  root.style.setProperty("--btn1", t.btn1);
  root.style.setProperty("--btn2", t.btn2);
  root.style.setProperty("--login", t.login);
  root.style.setProperty("--font", t.font);
  root.style.setProperty("--logo-x", t.logoX);
  root.style.setProperty("--logo-y", t.logoY);
  root.style.setProperty("--logo-size", t.logoSize + "px");
  document.body.style.fontFamily = t.font;
}

function isLogged() {
  return sessionStorage.getItem(AUTH_KEY) === "ok";
}

function login(user, pass) {
  if (user === "javier" && pass === "1234") {
    sessionStorage.setItem(AUTH_KEY, "ok");
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

function injectFlowers() {
  if (document.querySelector(".flowers")) return;
  const layer = document.createElement("div");
  layer.className = "flowers";
  layer.setAttribute("aria-hidden", "true");
  const svg = '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 30c6-12 16-14 16-6s-8 10-16 10c8 0 16 2 16 10s-10 6-16-6c0 12-8 14-16 6s2-10 10-10c-8 0-18-2-10-10s10 6 16 6z"/><circle cx="32" cy="32" r="5"/></svg>';
  for (let i = 1; i <= 6; i++) {
    const el = document.createElement("div");
    el.className = "flower f" + i;
    el.innerHTML = svg;
    layer.appendChild(el);
  }
  document.body.prepend(layer);
}

applyTheme();
injectFlowers();
