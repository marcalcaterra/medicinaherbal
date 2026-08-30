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

applyTheme();
