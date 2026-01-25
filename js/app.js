// ----- DAILY AFFIRMATION -----
/* We keep a list of affirmations, then pick one based on today's date.
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

// Get today's day-of-month (1–31)
const today = new Date().getDate();
// Turn that into a safe index within the affirmations array (0 → last index)
const affirmationIndex = today % affirmations.length;
// Set the text on the page
document.getElementById("affirmationText").textContent =
  affirmations[affirmationIndex];

// ----- TASK FORM ELEMENTS -----
// The <form> that wraps the task input and Add button
const taskForm = document.getElementById("taskForm");
// The <input> where the user types a new task
const taskInput = document.getElementById("taskInput");
// The <ul> that will contain the list of tasks
const taskList = document.getElementById("taskList");

// ----- TASK DATA -----
// This array will hold all task objects in memory
let tasks = [];

// ----- EVENT LISTENERS -----
// Get the text the user typed into the input
taskForm.addEventListener("submit", function (event) {
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
  // Update what the user sees
  renderTasks();
  taskInput.value = "";
});

// ----- UI RENDERING -----
function renderTasks() {
    /* 
    This function redraws the task list based on the tasks array
    */
  taskList.innerHTML = "";  // Clear the list first so we don't duplicate items

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
