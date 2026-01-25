// Find the paragraph element that will display the daily affirmation
// and set the text that appears inside it
// This runs as soon as the page loads
document.getElementById("affirmationText").textContent =
  "Ok, we’ve got this. One small step counts.";


// ----- TASK FORM ELEMENTS -----
// The <form> that wraps the task input and Add button
const taskForm = document.getElementById("taskForm");
// The <input> where the user types a new task
const taskInput = document.getElementById("taskInput");
// The <ul> that will contain the list of tasks
const taskList = document.getElementById("taskList");


// Listen for the user submitting the "Add task" form
taskForm.addEventListener("submit", function (event) {
    
  event.preventDefault(); // Stop the browser refreshing the page (default form behaviour)
});


// Get the text the user typed into the input
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // .trim() removes extra spaces at the start/end
  const text = taskInput.value.trim();

  // If the input is empty, stop here
  // This prevents blank tasks being added
  if (!text) return;

  // Create a new list item element in memory
  const li = document.createElement("li");
  li.textContent = text; // Put the task text inside the list item
  taskList.appendChild(li); // Add the new list item to the task list on the page

  // Clear the input field so it's ready for the next task
  taskInput.value = "";
});
