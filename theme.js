const THEME_KEY = "mar_theme_v6";
const AUTH_KEY = "mar_auth";

const DEFAULT_THEME = {
  bg: "#96ab82",
  btn1: "#2c4a38",
  btn2: "#ffffff",
  login: "#ffffff",
  font: '"Nunito", sans-serif',
  fontSize: 13,
  sway: 7,
  enter: 14,
  boxes: {
    logo: { x: 50, y: 10, w: 260, h: 210, r: 0 },
    turno: { x: 50, y: 68, w: 520, h: 58, r: 2 },
    cuenta: { x: 50, y: 78, w: 520, h: 58, r: 2 },
    login: { x: 50, y: 90, w: 120, h: 38, r: 40 }
  }
};

function cloneTheme(base) {
  return JSON.parse(JSON.stringify(base));
}

function getTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_KEY)) || {};
    const theme = cloneTheme(DEFAULT_THEME);
    Object.assign(theme, saved);
    theme.boxes = cloneTheme(DEFAULT_THEME.boxes);
    if (saved.boxes) {
      Object.keys(theme.boxes).forEach((key) => {
        theme.boxes[key] = { ...theme.boxes[key], ...(saved.boxes[key] || {}) };
      });
    }
    return theme;
  } catch (err) {
    return cloneTheme(DEFAULT_THEME);
  }
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  applyTheme(theme);
}

function applyBoxes(theme) {
  const boxes = (theme || getTheme()).boxes;
  Object.keys(boxes).forEach((name) => {
    const el = document.getElementById("box-" + name);
    if (!el) return;
    const b = boxes[name];
    el.style.left = b.x + "%";
    el.style.top = b.y + "%";
    el.style.width = b.w + "px";
    el.style.height = b.h + "px";
    el.style.borderRadius = (b.r || 0) + "px";
    el.style.transform = "translate(-50%, 0)";
  });
}

function applyTheme(theme) {
  const t = theme || getTheme();
  if (!document.body) return;
  const root = document.documentElement;
  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--btn1", t.btn1);
  root.style.setProperty("--btn2", t.btn2);
  root.style.setProperty("--login", t.login);
  root.style.setProperty("--font", t.font);
  root.style.setProperty("--font-size", t.fontSize + "px");
  root.style.setProperty("--sway", t.sway + "s");
  root.style.setProperty("--enter", (Number(t.enter) / 10) + "s");
  document.body.style.fontFamily = t.font;
  if (document.getElementById("box-logo")) document.body.style.background = t.bg;
  applyBoxes(t);
}

function isLogged() {
  try { return sessionStorage.getItem(AUTH_KEY) === "ok"; }
  catch (err) { return false; }
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

function bindEditor() {
  const editor = document.getElementById("editor");
  if (!editor || !isLogged()) return;
  document.body.classList.add("is-admin");

  const simple = {
    bg: (v) => v,
    btn1: (v) => v,
    btn2: (v) => v,
    font: (v) => v,
    fontSize: Number,
    sway: Number,
    enter: Number
  };
  const idMap = { bg: "bg", btn1: "btn1", btn2: "btn2", loginColor: "login", font: "font", fontSize: "fontSize", sway: "sway", enter: "enter" };
  Object.keys(idMap).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const key = idMap[id];
    el.value = getTheme()[key];
    el.addEventListener("input", () => {
      const next = getTheme();
      next[key] = (key === "bg" || key === "btn1" || key === "btn2" || key === "login" || key === "font") ? el.value : Number(el.value);
      saveTheme(next);
    });
  });

  const nameEl = document.getElementById("boxName");
  const sliders = { boxX: "x", boxY: "y", boxW: "w", boxH: "h", boxR: "r" };
  const fillSliders = () => {
    const box = getTheme().boxes[nameEl.value];
    document.getElementById("boxX").value = box.x;
    document.getElementById("boxY").value = box.y;
    document.getElementById("boxW").value = box.w;
    document.getElementById("boxH").value = box.h;
    document.getElementById("boxR").value = box.r || 0;
  };
  fillSliders();
  nameEl.addEventListener("change", fillSliders);
  Object.keys(sliders).forEach((id) => {
    document.getElementById(id).addEventListener("input", (e) => {
      const next = getTheme();
      next.boxes[nameEl.value][sliders[id]] = Number(e.target.value);
      saveTheme(next);
    });
  });

  document.querySelectorAll(".box").forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      if (!isLogged()) return;
      e.preventDefault();
      el.classList.add("dragging");
      const name = el.dataset.box;
      nameEl.value = name;
      fillSliders();
      const move = (ev) => {
        const next = getTheme();
        next.boxes[name].x = Math.round(Math.max(8, Math.min(92, (ev.clientX / window.innerWidth) * 100)));
        next.boxes[name].y = Math.round(Math.max(4, Math.min(92, (ev.clientY / window.innerHeight) * 100)));
        saveTheme(next);
        fillSliders();
      };
      const up = () => {
        el.classList.remove("dragging");
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    const fresh = cloneTheme(DEFAULT_THEME);
    saveTheme(fresh);
    Object.keys(idMap).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = fresh[idMap[id]];
    });
    fillSliders();
  });
  document.getElementById("salir").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  bindEditor();
});
