const taskList = document.getElementById("task-list");
const addTaskBtn = document.getElementById("add-task");
const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("task-desc");
const taskPriorityInput = document.getElementById("task-priority");
const taskDeadlineInput = document.getElementById("task-deadline");
const searchTaskInput = document.getElementById("search-task");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const renderTasks = (filter = "all") => {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (filter === "high-priority") {
    filteredTasks = tasks.filter((task) => task.priority === "high");
  }

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task ${task.completed ? "completed" : ""}`;

    taskItem.innerHTML = `
      <div class="task-header">
        <span>${task.title}</span>
        <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
      </div>
      <div class="task-details">
        <p>${task.description}</p>
        <small>Deadline: ${task.deadline}</small>
      </div>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Complete"}</button>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
};

const addTask = () => {
  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();
  const priority = taskPriorityInput.value;
  const deadline = taskDeadlineInput.value;

  if (!title || !deadline) {
    alert("Task title and deadline are required!");
    return;
  }

  tasks.push({ title, description, priority, deadline, completed: false });
  saveTasks();
  renderTasks();
  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskPriorityInput.value = "low";
  taskDeadlineInput.value = "";
};

const toggleComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
};

const editTask = (index) => {
  const newTitle = prompt("Edit Task Title:", tasks[index].title);
  const newDesc = prompt("Edit Task Description:", tasks[index].description);

  if (newTitle !== null) tasks[index].title = newTitle.trim();
  if (newDesc !== null) tasks[index].description = newDesc.trim();

  saveTasks();
  renderTasks();
};

const deleteTask = (index) => {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
};

filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    renderTasks(button.getAttribute("data-filter"));
  })
);

searchTaskInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
  );
  taskList.innerHTML = "";
  filteredTasks.forEach((task) => renderTasks());
});

addTaskBtn.addEventListener("click", addTask);

renderTasks();
