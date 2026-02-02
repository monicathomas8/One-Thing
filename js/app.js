// =======================1) DAILY AFFIRMATIONS (DATA) =======================
/*
  We keep a list of affirmations, then pick one based on today's date.
  Result: it stays the same all day, and changes automatically tomorrow.
*/
const affirmations = [
  "Ok, we’ve got this. One small step counts.",
  "Give me the vibe, I’ll do the sorting.",
  "You’re not alone, we’ll do one thing at a time.",
  "Breathe first. Then the next tiny step.",
  "Progress can be quiet. It still counts.",
  "No pressure. Just one gentle win today.",
  "Today doesn’t need to be perfect.",
  "Small effort is still effort.",
  "You’re allowed to go slowly.",
  "It’s safe to focus on one thing.",
  "Little by little, we get there.",
  "One thing is enough for today.",
  "You don’t need to do it all - just something.",
];

// =======================2) DOM ELEMENTS (REFERENCES) =======================
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const affirmationTextEl = document.getElementById("affirmationText");
const doneHint = document.getElementById("doneHint");

// VIBE
const vibeCard = document.getElementById("vibeCard");
const vibeSaveBtn = document.getElementById("vibeSaveBtn");
const vibeSkipBtn = document.getElementById("vibeSkipBtn");

// ONE THING
const pickBtn = document.getElementById("pickBtn");
const focusTextEl = document.getElementById("focusText");

// FOCUS OVERLAY
const focusOverlay = document.getElementById("focusOverlay");
const focusOverlayTask = document.getElementById("focusOverlayTask");
const focusNotes = document.getElementById("focusNotes");
const focusCloseBtn = document.getElementById("focusCloseBtn");
const focusDoneBtn = document.getElementById("focusDoneBtn");
const focusStartBtn = document.getElementById("focusStartBtn");
const focusFiveBtn = document.getElementById("focusFiveBtn");
const focusBreatheBtn = document.getElementById("focusBreatheBtn");

// BREATHE OVERLAY
const breatheOverlay = document.getElementById("breatheOverlay");
const breatheStartBtn = document.getElementById("breatheStartBtn");
const breatheCloseBtn = document.getElementById("breatheCloseBtn");
const pageBreatheBtn = document.getElementById("pageBreatheBtn");
const breatheCircle = document.querySelector(".breatheCircle");
const breatheStatus = document.getElementById("breatheStatus");
const navBreatheBtn = document.getElementById("navBreatheBtn");

// MENU OVERLAY ELEMENTS
const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");
const menuCloseBtn = document.getElementById("menuCloseBtn");
const menuBreatheBtn = document.getElementById("menuBreatheBtn");


// Today screen buttons
const goBrainDumpBtn = document.getElementById("goBrainDumpBtn");
const goBreatheBtn = document.getElementById("goBreatheBtn");

// ======================= SCREENS (ONE AT A TIME) =======================
const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach((s) => s.classList.remove("isActive"));
  const next = document.getElementById(id);
  if (next) next.classList.add("isActive");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ======================= 3) STATE (APP DATA) =======================
let tasks = [];

let vibeTaskIndex = null;
let selectedVibe = {
  impact: "medium",
  minutes: 15,
  pressure: "later",
};

let currentFocusIndex = null;

// ======================= 4) STORAGE HELPERS (LOCAL STORAGE) =======================
function saveTasks() {
  localStorage.setItem("oneThingTasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("oneThingTasks");
  if (!saved) return;
  tasks = JSON.parse(saved);
}

// ======================= 5) CORE LOGIC (UI + APP BEHAVIOUR) =======================
function setDailyAffirmation() {
  const today = new Date().getDate();
  const affirmationIndex = today % affirmations.length;
  if (affirmationTextEl) {
    affirmationTextEl.textContent = affirmations[affirmationIndex];
  }
}

function renderTasks() {
  if (!taskList) return;

  if (doneHint) doneHint.hidden = tasks.length === 0;

  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const li = document.createElement("li");

    // --- Task title text ---
    const title = document.createElement("div");
    title.textContent = task.text;
    li.appendChild(title);

    // --- Meta line (progress + notes preview) ---
    const meta = document.createElement("div");
    meta.style.opacity = "0.75";
    meta.style.fontSize = "13px";
    meta.style.marginTop = "6px";

    const bits = [];
    if (task.startedAt) bits.push("Started");

    if (typeof task.minutesDone === "number" && task.minutesDone > 0) {
      bits.push(`${task.minutesDone} mins done`);
    }

    if (typeof task.notes === "string" && task.notes.trim().length > 0) {
      const preview = task.notes.trim().slice(0, 60);
      bits.push(`Notes: ${preview}${task.notes.trim().length > 60 ? "…" : ""}`);
    }

    meta.textContent = bits.length ? bits.join(" • ") : "";
    li.appendChild(meta);

    // --- Action buttons row ---
    const actions = document.createElement("div");
    actions.classList.add("actions");
    actions.style.marginTop = "10px";
    actions.style.display = "flex";
    actions.style.gap = "10px";

    // ✅ Done toggle button
    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.done ? "✅ Done" : "☐ Mark done";
    doneBtn.classList.add("secondary");
    doneBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleTaskDone(index);
    });

    // 🗑️ Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Delete it?";
    deleteBtn.classList.add("secondary");
    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      deleteTask(index);
    });

    actions.appendChild(doneBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);

    if (task.done) li.classList.add("done");

    taskList.appendChild(li);
  });
}

function openVibePanel(forTaskIndex) {
  vibeTaskIndex = forTaskIndex;

  const t = tasks[vibeTaskIndex];
  selectedVibe = {
    impact: t.impact,
    minutes: t.minutes,
    pressure: t.pressure,
  };

  syncVibeButtonUI();

  // IMPORTANT: with "screens", we do NOT use vibeCard.hidden
  showScreen("screen-vibe");
}

function closeVibePanel() {
  vibeTaskIndex = null;
  // After vibe, send them to the list so they’re not “stuck”
  showScreen("screen-list");
}

function syncVibeButtonUI() {
  if (!vibeCard) return;
  const rows = vibeCard.querySelectorAll(".vibeRow");

  rows.forEach(function (row) {
    const field = row.dataset.field;
    const buttons = row.querySelectorAll("button");

    buttons.forEach(function (btn) {
      const value = btn.dataset.value;

      const selectedValue =
        field === "minutes"
          ? String(selectedVibe.minutes)
          : String(selectedVibe[field]);

      btn.classList.toggle("selected", value === selectedValue);
    });
  });
}

function openFocusOverlay(taskIndex) {
  currentFocusIndex = taskIndex;

  const task = tasks[taskIndex];
  if (focusOverlayTask) focusOverlayTask.textContent = task.text;

  if (typeof task.notes !== "string") task.notes = "";
  if (focusNotes) focusNotes.value = task.notes;

  if (focusOverlay) focusOverlay.hidden = false;
  if (focusNotes) focusNotes.focus();
}

function closeFocusOverlay() {
  if (focusOverlay) focusOverlay.hidden = true;
}

// ======================= 6) EVENT HANDLERS =======================
function handleTaskSubmit(event) {
  event.preventDefault();
  if (!taskInput) return;

  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    text,
    done: false,
    notes: "",
    impact: "medium",
    minutes: 15,
    pressure: "later",
  };

  tasks.push(task);
  const newIndex = tasks.length - 1;

  saveTasks();
  renderTasks();

  taskInput.value = "";

  // Now ask for vibe
  openVibePanel(newIndex);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleTaskDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function scoreTask(task) {
  const impactScore = { big: 5, medium: 3, small: 1 }[task.impact];
  const pressureScore = { soon: 4, later: 2, none: 0 }[task.pressure];
  const timeScore = { 5: 4, 15: 3, 30: 2, 60: 0 }[task.minutes];
  return impactScore + pressureScore + timeScore;
}

function pickOneThingIndex() {
  const candidates = tasks
    .map((task, index) => ({ task, index, score: scoreTask(task) }))
    .filter((item) => item.task.done === false)
    .sort((a, b) => b.score - a.score);

  if (candidates.length === 0) return null;

  const topCount = Math.min(3, candidates.length);
  const topChoices = candidates.slice(0, topCount);

  const chosen = topChoices[Math.floor(Math.random() * topChoices.length)];
  return chosen.index;
}

function handlePickOneThing() {
  const chosenIndex = pickOneThingIndex();

  if (chosenIndex === null) {
    currentFocusIndex = null;
    if (focusTextEl) {
      focusTextEl.textContent = "Nothing left to pick. Ok… that’s a win. 💛";
    }
    return;
  }

  const chosenTask = tasks[chosenIndex];
  if (focusTextEl) {
    focusTextEl.textContent = `Ok, we’ve got this. Your One Thing is: ${chosenTask.text}`;
  }

  openFocusOverlay(chosenIndex);
}

function handleFocusStart() {
  if (currentFocusIndex === null) return;

  const task = tasks[currentFocusIndex];
  task.startedAt = new Date().toISOString();

  saveTasks();
  renderTasks();
}

function handleFocusFiveMinutes() {
  if (currentFocusIndex === null) return;

  const task = tasks[currentFocusIndex];
  if (typeof task.minutesDone !== "number") task.minutesDone = 0;
  task.minutesDone += 5;

  saveTasks();
  renderTasks();
}

function handleFocusDone() {
  if (currentFocusIndex === null) return;

  tasks[currentFocusIndex].done = true;
  saveTasks();
  renderTasks();
  closeFocusOverlay();
}

function openBreatheOverlay() {
  if (breatheOverlay) breatheOverlay.hidden = false;
}

function closeBreatheOverlay() {
  if (breatheOverlay) breatheOverlay.hidden = true;
  stopBreathing();
}

// ======================= 7) BREATHE TIMING =======================
let breatheIntervalId = null;

function startBreathing() {
  if (!breatheCircle) return;

  if (breatheIntervalId) {
    clearTimeout(breatheIntervalId);
    breatheIntervalId = null;
  }

  breatheCircle.classList.add("isBreathing");
  if (breatheStatus) breatheStatus.textContent = "Let’s begin. Inhale…";

  const phases = [
    { text: "Inhale…", duration: 4000 },
    { text: "Hold…", duration: 3000 },
    { text: "Exhale…", duration: 5000 },
    { text: "Hold…", duration: 3000 },
  ];

  let phaseIndex = 0;

  function showPhase() {
    if (breatheStatus) breatheStatus.textContent = phases[phaseIndex].text;

    const nextDuration = phases[phaseIndex].duration;
    phaseIndex = (phaseIndex + 1) % phases.length;

    breatheIntervalId = setTimeout(showPhase, nextDuration);
  }

  showPhase();
}

function stopBreathing() {
  if (breatheCircle) breatheCircle.classList.remove("isBreathing");

  if (breatheIntervalId) {
    clearTimeout(breatheIntervalId);
    breatheIntervalId = null;
  }

  if (breatheStatus) breatheStatus.textContent = "Ready when you are.";
}

// ======================= 8) NAV / BUTTON WIRING =======================

// Screen nav (buttons with data-screen)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-screen]");
  if (!btn) return;
  showScreen(btn.dataset.screen);
});

// Today screen CTAs
if (goBrainDumpBtn) {
  goBrainDumpBtn.addEventListener("click", () => showScreen("screen-brainDump"));
}

if (goBreatheBtn) {
  goBreatheBtn.addEventListener("click", openBreatheOverlay);
}

// Form submit
if (taskForm) {
  taskForm.addEventListener("submit", handleTaskSubmit);
}

// Vibe panel click (event delegation)
if (vibeCard) {
  vibeCard.addEventListener("click", function (event) {
    const btn = event.target.closest("button");
    if (!btn) return;

    if (btn.id === "vibeSaveBtn" || btn.id === "vibeSkipBtn") return;

    const row = btn.closest(".vibeRow");
    if (!row) return;

    const field = row.dataset.field;
    const value = btn.dataset.value;

    if (field === "minutes") {
      selectedVibe.minutes = Number(value);
    } else {
      selectedVibe[field] = value;
    }

    syncVibeButtonUI();
  });
}

// Vibe Save/Skip
if (vibeSaveBtn) {
  vibeSaveBtn.addEventListener("click", function () {
    if (vibeTaskIndex === null) return;

    tasks[vibeTaskIndex].impact = selectedVibe.impact;
    tasks[vibeTaskIndex].minutes = selectedVibe.minutes;
    tasks[vibeTaskIndex].pressure = selectedVibe.pressure;

    saveTasks();
    renderTasks();
    closeVibePanel();
  });
}

if (vibeSkipBtn) {
  vibeSkipBtn.addEventListener("click", closeVibePanel);
}

// One Thing
if (pickBtn) pickBtn.addEventListener("click", handlePickOneThing);

// Focus overlay buttons
if (focusCloseBtn) focusCloseBtn.addEventListener("click", closeFocusOverlay);
if (focusStartBtn) focusStartBtn.addEventListener("click", handleFocusStart);
if (focusFiveBtn) focusFiveBtn.addEventListener("click", handleFocusFiveMinutes);
if (focusDoneBtn) focusDoneBtn.addEventListener("click", handleFocusDone);
if (focusBreatheBtn) focusBreatheBtn.addEventListener("click", openBreatheOverlay);

// Breathe overlay buttons
if (breatheCloseBtn) breatheCloseBtn.addEventListener("click", closeBreatheOverlay);
if (breatheStartBtn) breatheStartBtn.addEventListener("click", startBreathing);

// Page + nav breathe buttons
if (pageBreatheBtn) pageBreatheBtn.addEventListener("click", openBreatheOverlay);
if (navBreatheBtn) navBreatheBtn.addEventListener("click", openBreatheOverlay);

// ======================= MENU OVERLAY EVENTS =======================

menuBtn.addEventListener("click", () => {
  menuOverlay.hidden = false;
});

menuCloseBtn.addEventListener("click", () => {
  menuOverlay.hidden = true;
});

menuBreatheBtn.addEventListener("click", () => {
  menuOverlay.hidden = true;
  openBreatheOverlay();
});

// Navigate + close menu
menuOverlay.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-screen]");
  if (!btn) return;
  menuOverlay.hidden = true;
  showScreen(btn.dataset.screen);
});


// ======================= 9) INIT / BOOTSTRAP =======================
loadTasks();
setDailyAffirmation();
renderTasks();

// Default view
showScreen("screen-today");

// Keep notes saved live
if (focusNotes) {
  focusNotes.addEventListener("input", function () {
    if (currentFocusIndex === null) return;
    tasks[currentFocusIndex].notes = focusNotes.value;
    saveTasks();
    renderTasks();
  });
}
