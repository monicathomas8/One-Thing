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
// The <form> that wraps the task input and Add button
const taskForm = document.getElementById("taskForm");
// The <input> where the user types a new task
const taskInput = document.getElementById("taskInput");
// The <ul> that will contain the list of tasks
const taskList = document.getElementById("taskList");
// The element where the daily affirmation appears
const affirmationTextEl = document.getElementById("affirmationText");
// The hint that shows when there are no tasks
const doneHint = document.getElementById("doneHint");
// VIBE CARD ELEMENTS
const vibeCard = document.getElementById("vibeCard");
const vibeSaveBtn = document.getElementById("vibeSaveBtn");
const vibeSkipBtn = document.getElementById("vibeSkipBtn");
// Focus card elements (Pick my One Thing)
const pickBtn = document.getElementById("pickBtn");
const focusTextEl = document.getElementById("focusText");
// FOCUS OVERLAY ELEMENTS
const focusOverlay = document.getElementById("focusOverlay");
const focusOverlayTask = document.getElementById("focusOverlayTask");
const focusNotes = document.getElementById("focusNotes");
const focusCloseBtn = document.getElementById("focusCloseBtn");
const focusDoneBtn = document.getElementById("focusDoneBtn");
const focusStartBtn = document.getElementById("focusStartBtn");
const focusFiveBtn = document.getElementById("focusFiveBtn");
const focusBreatheBtn = document.getElementById("focusBreatheBtn");
// BREATHE OVERLAY ELEMENTS
const breatheOverlay = document.getElementById("breatheOverlay");
const breatheStartBtn = document.getElementById("breatheStartBtn");
const breatheCloseBtn = document.getElementById("breatheCloseBtn");
const pageBreatheBtn = document.getElementById("pageBreatheBtn");



// ======================= 3) STATE (APP DATA) =======================
/*
  This array will hold all task objects in memory.
  Later we’ll add vibe fields (impact/time/pressure), notes, etc.
*/
let tasks = [];

// Which task are we currently setting vibes for?
let vibeTaskIndex = null;
// Temporary vibe values while the user taps buttons
let selectedVibe = {
  impact: "medium",
  minutes: 15,
  pressure: "later",
};

let currentFocusIndex = null;

// ======================= 4) STORAGE HELPERS (LOCAL STORAGE) =======================
/*
  LocalStorage can only store strings, so we use JSON to save/restore our tasks array.
*/
function saveTasks() {
  localStorage.setItem("oneThingTasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("oneThingTasks");

  // If there's nothing saved yet, do nothing
  if (!saved) return;

  // Turn the saved JSON string back into an array of task objects
  tasks = JSON.parse(saved);
}

// ======================= 5) CORE LOGIC (UI + APP BEHAVIOUR) =======================

function setDailyAffirmation() {
  /*
    DAILY AFFIRMATION LOGIC
    - Get today's day-of-month (1–31)
    - Turn that into a safe index within the affirmations array
    - Set the text on the page
    */
  const today = new Date().getDate();
  const affirmationIndex = today % affirmations.length;
  affirmationTextEl.textContent = affirmations[affirmationIndex];
}

function renderTasks() {
  // Show the "click to mark done" hint only if there are tasks
  doneHint.hidden = tasks.length === 0;

  // Clear the list first so we don't duplicate items
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
    if (task.startedAt) {
      bits.push("Started");
    }

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

    // Done styling
    if (task.done) {
      li.classList.add("done");
    }

    taskList.appendChild(li);
  });
}

function openVibePanel(forTaskIndex) {
  vibeTaskIndex = forTaskIndex;
  /*
        Show the vibe panel for a specific task (usually the newest one)
        We also reset the selection UI so it feels clean and obvious.
        */
  const t = tasks[vibeTaskIndex];
  // Start from the task's current values (defaults or previously set)
  selectedVibe = {
    impact: t.impact,
    minutes: t.minutes,
    pressure: t.pressure,
  };

  // Update button "selected" states to match selectedVibe
  syncVibeButtonUI();

  // Show the panel
  vibeCard.hidden = false;
}

function closeVibePanel() {
  /*
  Hide the vibe panel and clear the current selection target
*/
  vibeCard.hidden = true;
  vibeTaskIndex = null;
}

function syncVibeButtonUI() {
  /*
    Adds/removes a "selected" class on vibe buttons so the user
    can SEE what they've picked (super important for UX).
    */
  const rows = vibeCard.querySelectorAll(".vibeRow");

  rows.forEach(function (row) {
    const field = row.dataset.field; // "impact" | "minutes" | "pressure"
    const buttons = row.querySelectorAll("button");

    buttons.forEach(function (btn) {
      const value = btn.dataset.value;

      // Compare as strings (minutes are stored as numbers)
      const selectedValue =
        field === "minutes"
          ? String(selectedVibe.minutes)
          : String(selectedVibe[field]);

      btn.classList.toggle("selected", value === selectedValue);
    });
  });
}

function openFocusOverlay(taskIndex) {
  /*
  Open Focus Mode for a specific task index.
  Shows the overlay + loads notes for that task.
*/
  currentFocusIndex = taskIndex;

  const task = tasks[taskIndex];
  focusOverlayTask.textContent = task.text;

  // Ensure notes exists (older tasks might not have it yet)
  if (typeof task.notes !== "string") {
    task.notes = "";
  }

  focusNotes.value = task.notes;

  focusOverlay.hidden = false;
  focusNotes.focus();
}

function closeFocusOverlay() {
  /*
    Close Focus Mode overlay.
    */
  focusOverlay.hidden = true;
}

// ======================= 6) EVENT HANDLERS =======================

function handleTaskSubmit(event) {
  // Handle the form submission to add a new task
  event.preventDefault();
  // Prevent the form from reloading the page

  const text = taskInput.value.trim();
  // Get the text the user typed (trim removes extra spaces)

  if (!text) return; // Prevent blank tasks being added

  const task = {
    // Create a task object with default fields
    text: text,
    done: false,
    notes: "",
    // Vibe defaults (user can change these later)
    impact: "medium", // "big" | "medium" | "small"
    minutes: 15, // 5 | 15 | 30 | 60
    pressure: "later", // "soon" | "later" | "none"
  };

  tasks.push(task); // Update state
  const newIndex = tasks.length - 1;
  openVibePanel(newIndex); // Open vibe panel for the new task

  // Persist + update UI
  saveTasks();
  renderTasks();

  taskInput.value = ""; // Reset input for nicer UX
}

function deleteTask(index) {
  //Delete a task by its index in the tasks array
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleTaskDone(index) {
  /*
    Toggle a task between done / not done
    */

  tasks[index].done = !tasks[index].done;
  // Flip the boolean value (true becomes false, false becomes true)
  saveTasks();
  renderTasks();
}

function scoreTask(task) {
  /*
    Calculate a focus score for a task based on its vibe.
    Higher score = better candidate for "One Thing".
    */
  const impactScore = {
    big: 5,
    medium: 3,
    small: 1,
  }[task.impact];

  const pressureScore = {
    soon: 4,
    later: 2,
    none: 0,
  }[task.pressure];

  const timeScore = {
    5: 4,
    15: 3,
    30: 2,
    60: 0,
  }[task.minutes];

  return impactScore + pressureScore + timeScore;
}

function pickOneThingIndex() {
  /*
  Pick a task index using:
  - only tasks that are not done
  - scoreTask() to rank them
  - gentle randomness: choose from the top 3
*/
  const candidates = tasks
    .map(function (task, index) {
      return { task, index, score: scoreTask(task) };
    })
    .filter(function (item) {
      return item.task.done === false;
    })
    .sort(function (a, b) {
      return b.score - a.score; // high score first
    });

  if (candidates.length === 0) return null;

  const topCount = Math.min(3, candidates.length);
  const topChoices = candidates.slice(0, topCount);

  const chosen = topChoices[Math.floor(Math.random() * topChoices.length)];
  return chosen.index;
}

function handlePickOneThing() {
  /*
    When the user clicks "Pick my One Thing",
    choose a task and open Focus Mode.
    */
  const chosenIndex = pickOneThingIndex();

  if (chosenIndex === null) {
    currentFocusIndex = null;
    focusTextEl.textContent = "Nothing left to pick. Ok… that’s a win. 💛";
    return;
  }

  // Show it in the card as reassurance
  const chosenTask = tasks[chosenIndex];
  focusTextEl.textContent = `Ok, we’ve got this. Your One Thing is: ${chosenTask.text}`;

  // Open Focus Mode overlay
  openFocusOverlay(chosenIndex);
}

function handleFocusStart() {
  /*
    Mark the current focus task as "started".
    We store a timestamp so you could later show "started 10 mins ago" etc.
    */
  if (currentFocusIndex === null) return;

  const task = tasks[currentFocusIndex];

  // Store a start timestamp (ISO string = easy to save in LocalStorage)
  task.startedAt = new Date().toISOString();

  saveTasks();
  renderTasks();
}

function handleFocusFiveMinutes() {
  /*
    Add 5 minutes of progress to the current focus task.
    This is gentle progress tracking without pressure.
    */

  if (currentFocusIndex === null) return;

  const task = tasks[currentFocusIndex];

  // If minutesDone doesn't exist yet, start from 0
  if (typeof task.minutesDone !== "number") {
    task.minutesDone = 0;
  }

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

function handleFocusBreathe() {
    /*
    Show a simple breathing prompt in the overlay.
    */
  focusOverlayTask.textContent = "Let’s breathe together.";

  focusNotes.value =
    "Inhale for 4…\nHold for 4…\nExhale for 6…\n\nJust a few rounds. You’re safe.";

  focusNotes.blur(); // removes cursor = less “work” feeling
}

function openBreatheOverlay() {
  /*
    Show the breathe overlay.
    */
  breatheOverlay.hidden = false;
}

function closeBreatheOverlay() {
  /*
    Hide the breathe overlay.
    */
  breatheOverlay.hidden = true;
}

// ======================= 7) INIT / BOOTSTRAP =======================
// Connect events
taskForm.addEventListener("submit", handleTaskSubmit);

// Load saved data first, then render UI
loadTasks();
setDailyAffirmation();
renderTasks();

// When a vibe button is clicked, update selectedVibe and refresh UI.
// We use ONE listener on the card (event delegation) instead of 9 separate listeners.
vibeCard.addEventListener("click", function (event) {
  const btn = event.target.closest("button");
  if (!btn) return;

  // Ignore Save/Skip buttons here (they have their own listeners)
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

// Save vibe into the correct task, persist, re-render, close panel
vibeSaveBtn.addEventListener("click", function () {
  if (vibeTaskIndex === null) return;

  tasks[vibeTaskIndex].impact = selectedVibe.impact;
  tasks[vibeTaskIndex].minutes = selectedVibe.minutes;
  tasks[vibeTaskIndex].pressure = selectedVibe.pressure;

  saveTasks();
  renderTasks();
  closeVibePanel();
});

// Skip just closes the panel (no guilt, no friction)
vibeSkipBtn.addEventListener("click", function () {
  closeVibePanel();
});

// Close button
focusCloseBtn.addEventListener("click", closeFocusOverlay);

// Save notes as the user types (gentle + automatic)
focusNotes.addEventListener("input", function () {
  if (currentFocusIndex === null) return;

  tasks[currentFocusIndex].notes = focusNotes.value;
  saveTasks();
  renderTasks(); // update the task list preview immediately
});

// Pick button should already be wired, but if not:
pickBtn.addEventListener("click", handlePickOneThing);

// Focus action buttons
focusStartBtn.addEventListener("click", handleFocusStart);
focusFiveBtn.addEventListener("click", handleFocusFiveMinutes);
focusDoneBtn.addEventListener("click", handleFocusDone);
// Bottom-page breathe button
focusBreatheBtn.addEventListener("click", openBreatheOverlay);
// Breathe overlay buttons
breatheCloseBtn.addEventListener("click", closeBreatheOverlay);
pageBreatheBtn.addEventListener("click", openBreatheOverlay);

