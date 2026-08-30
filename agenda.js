const AGENDA_KEY = "mar_agenda_v1";
const HOURS = ["09:00","10:00","11:00","12:00","16:00","17:00","18:00"];

function pad(n) { return String(n).padStart(2, "0"); }
function isoDay(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function defaultAgenda() {
  const available = {};
  const booked = {};
  const start = new Date();
  start.setHours(0,0,0,0);
  for (let i = 1; i <= 45; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    available[isoDay(d)] = ["09:00","10:00","11:00","16:00","17:00"];
  }
  return { available, booked, bookings: [] };
}

function getAgenda() {
  try {
    const saved = JSON.parse(localStorage.getItem(AGENDA_KEY));
    if (saved && saved.available) return saved;
  } catch (err) {}
  const fresh = defaultAgenda();
  localStorage.setItem(AGENDA_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveAgenda(agenda) {
  localStorage.setItem(AGENDA_KEY, JSON.stringify(agenda));
}

function freeHours(date) {
  const agenda = getAgenda();
  const avail = agenda.available[date] || [];
  const used = agenda.booked[date] || [];
  return avail.filter((h) => !used.includes(h));
}

function dayStatus(date) {
  const free = freeHours(date);
  if (free.length) return "green";
  return "red";
}

function bookSlot(date, hour, nombre, telefono) {
  const agenda = getAgenda();
  if (!freeHours(date).includes(hour)) return false;
  agenda.booked[date] = agenda.booked[date] || [];
  agenda.booked[date].push(hour);
  agenda.bookings = agenda.bookings || [];
  agenda.bookings.push({ date, hour, nombre, telefono, at: Date.now() });
  saveAgenda(agenda);
  return true;
}
