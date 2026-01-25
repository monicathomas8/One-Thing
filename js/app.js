/* ----- DAILY AFFIRMATION -----
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

/*------- DAILY AFFIRMATION LOGIC -----
Get today's day-of-month (1–31)
Turn that into a safe index within the affirmations array (0 → last index)
Set the text on the page 
*/
const today = new Date().getDate();
const affirmationIndex = today % affirmations.length;
document.getElementById("affirmationText").textContent =
  affirmations[affirmationIndex];

// ----- TASK FORM ELEMENTS -----
const taskForm = document.getElementById("taskForm"); // The <form> that wraps the task input and Add button
const taskInput = document.getElementById("taskInput"); // The <input> where the user types a new task
const taskList = document.getElementById("taskList"); // The <ul> that will contain the list of tasks

/* ----- TASK DATA -----
 This array will hold all task objects in memory
*/
let tasks = [];

/* ----- LOCAL STORAGE -----
 LocalStorage can only store strings, so we use JSON to save/restore our tasks array. */
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

// Load saved tasks as soon as the page opens, then render them
loadTasks();
renderTasks();

// ----- EVENT HANDLERS -----
// Named handler: easier to read, debug, and reuse as the app grows/
function handleTaskSubmit(event) {
  event.preventDefault();
  // .trim() removes extra spaces at the start/end
  const text = taskInput.value.trim();
  if (!text) return; // This prevents blank tasks being added
  // Create a task object instead of just text
  const task = {
    text: text,
    done: false,
  };

  // Add the task object to our tasks array
  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

// Connect the handler to the form submit event
taskForm.addEventListener("submit", handleTaskSubmit);

/* ----- UI RENDERING -----
 This function redraws the task list based on the tasks array */
function renderTasks() {
  taskList.innerHTML = ""; // Clear the list first so we don't duplicate items
  // Loop through each task object
  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    // Show the task text
    li.textContent = task.text;

    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Delete it?";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.color = "inherit";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.addEventListener("click", function () {
      // Remove this task from the array
      tasks.splice(index, 1);
      // Re-render the list
      saveTasks();
      renderTasks();
    });

    li.appendChild(deleteBtn);
    // If the task is done, style it differently (later)
    if (task.done) {
      li.style.opacity = "0.5";
    }
    taskList.appendChild(li);
  });
}
