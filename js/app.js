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



// ======================= 3) STATE (APP DATA) =======================
/*
  This array will hold all task objects in memory.
  Later we’ll add vibe fields (impact/time/pressure), notes, etc.
*/
let tasks = [];


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
    /*
    UI RENDERING This function redraws the task list based on the tasks array
    */
  doneHint.hidden = tasks.length === 0;
    // Show the "click to mark done" hint only if there are tasks

  taskList.innerHTML = "";
    // Clear the list first so we don't duplicate items

  tasks.forEach(function (task, index) {
    // Loop through each task object in the tasks array
    const li = document.createElement("li");

    li.textContent = task.text;  // Show the task text
   
    li.addEventListener("click", function () {
        // Clicking the task text toggles done/undone
    toggleTaskDone(index);
    });


    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Delete it?";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.color = "inherit";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent the li click event from firing
        deleteTask(index);
    });

    li.appendChild(deleteBtn);
    // If the task is done, style it differently (later)
    if (task.done) {
    li.classList.add("done");
    }


    taskList.appendChild(li);
  });
}

// ======================= 6) EVENT HANDLERS =======================

function handleTaskSubmit(event) {
    // Handle the form submission to add a new task
  event.preventDefault();
    // Prevent the form from reloading the page

  // Get the text the user typed (trim removes extra spaces)
  const text = taskInput.value.trim();

  // Prevent blank tasks being added
  if (!text) return;

  // Create a task object (we’ll expand this later with vibe fields)
  const task = {
    text: text,
    done: false,
  };

  // Update state
  tasks.push(task);

  // Persist + update UI
  saveTasks();
  renderTasks();

  // Reset input for nicer UX
  taskInput.value = "";
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


// ======================= 7) INIT / BOOTSTRAP =======================
// Connect events
taskForm.addEventListener("submit", handleTaskSubmit);

// Load saved data first, then render UI
loadTasks();
setDailyAffirmation();
renderTasks();
