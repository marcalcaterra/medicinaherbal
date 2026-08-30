const THEME_KEY = "mar_theme";
const AUTH_KEY = "mar_auth";

const DEFAULT_THEME = {
  bg: "#96ab82",
  btn1: "#234634",
  btn2: "#ffffff",
  font: '"Manrope", sans-serif',
  logoX: 50,
  logoY: 18,
  logoSize: 280
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
  root.style.setProperty("--btn1", t.btn1);
  root.style.setProperty("--btn2", t.btn2);
  root.style.setProperty("--font", t.font);
  root.style.setProperty("--logo-x", t.logoX + "%");
  root.style.setProperty("--logo-y", t.logoY + "%");
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
