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
  } catch (err) {
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
  try {
    return sessionStorage.getItem(AUTH_KEY) === "ok";
  } catch (err) {
    return false;
  }
}

function login(user, pass) {
  if (String(user).trim().toLowerCase() === "javier" && String(pass) === "1234") {
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

function hexToRgb(hex) {
  const h = String(hex).replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function contrastOk(a, b) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const lum = (c) => {
    const s = [c.r, c.g, c.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
  };
  const L1 = lum(A);
  const L2 = lum(B);
  const d = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return d >= 2.2;
}

function startBot() {
  if (!isLogged() || document.querySelector(".bot-mar")) return;
  const box = document.createElement("aside");
  box.className = "bot-mar";
  box.innerHTML = "<h3><span class='bot-dot'></span>Bot Mar</h3><p id='botMsg'>Revisando fluidez y contraste...</p>";
  document.body.appendChild(box);
  const msg = box.querySelector("#botMsg");
  const jobs = [
    "Suavizando transiciones de color",
    "Acomodando el ritmo de las flores",
    "Revisando contraste de botones",
    "Ajustando sombras de las tarjetas",
    "Controlando tamaño del logo",
    "Manteniendo la página fluida"
  ];
  let i = 0;
  const tick = () => {
    const theme = getTheme();
    if (!contrastOk(theme.btn1, theme.bg)) {
      theme.btn1 = "#234634";
      saveTheme(theme);
      msg.textContent = "Subí el contraste del botón Agendá para que se lea mejor.";
    } else if (theme.logoSize > 340) {
      theme.logoSize = 280;
      saveTheme(theme);
      msg.textContent = "Reduje un poco el logo para que no tape los botones.";
    } else {
      msg.textContent = jobs[i % jobs.length] + ".";
      i += 1;
    }
  };
  tick();
  setInterval(tick, 7000);
}

function enableLogoDrag() {
  const wrap = document.getElementById("logoWrap");
  if (!wrap || !isLogged()) return;
  wrap.classList.add("draggable");
  let dragging = false;
  wrap.addEventListener("pointerdown", (e) => {
    dragging = true;
    wrap.classList.add("dragging");
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener("pointerup", () => {
    dragging = false;
    wrap.classList.remove("dragging");
  });
  wrap.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const card = wrap.parentElement.getBoundingClientRect();
    const theme = getTheme();
    theme.logoX = Math.max(10, Math.min(90, ((e.clientX - card.left) / card.width) * 100));
    theme.logoY = Math.max(10, Math.min(90, ((e.clientY - card.top) / card.height) * 100));
    saveTheme(theme);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  injectFlowers();
  enableLogoDrag();
  startBot();
});

applyTheme();
injectFlowers();
