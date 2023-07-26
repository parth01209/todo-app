const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const searchInput = document.querySelector(".search-input");
const todoOutput = document.querySelector(".todo-output");

const getStoredTasks = () => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};

const renderTodo = (task) => {
  const todoItem = document.createElement("div");
  todoItem.className = `todo-item ${task.id}`;
  todoItem.innerHTML = `
    <input type="checkbox" class="todo-check" ${
      task.completed ? "checked" : ""
    }/>
    <input type="text" class="todo-text" ${
      task.completed ? 'style="text-decoration: line-through;"' : ""
    } value="${task.todo}" disabled />
    <button class="todo-edit">${task.completed ? "Completed" : "Edit"}</button>
    <button class="todo-delete">Delete</button>
  `;
  todoOutput.appendChild(todoItem);
};

const addTodoToLocalStorage = (task) => {
  const tasks = getStoredTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const deleteTodoFromLocalStorage = (id) => {
  const tasks = getStoredTasks().filter((task) => task.id !== parseInt(id));
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const editTodoInLocalStorage = (id, todo) => {
  const tasks = getStoredTasks().map((task) => {
    if (task.id === parseInt(id)) {
      task.todo = todo;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const deleteTodo = (e) => {
  if (e.target.classList.contains("todo-delete")) {
    const taskId = e.target.parentElement.classList[1];
    deleteTodoFromLocalStorage(taskId);
    e.target.parentElement.remove();
  }
};

const checkedTodo = (e) => {
  if (e.target.className === "todo-check") {
    const id = e.target.parentElement.classList[1];
    const checked = e.target.checked;

    let tasks = getStoredTasks();
    tasks = tasks.map((task) => {
      if (task.id === parseInt(id)) {
        task.completed = checked;
      }
      return task;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
};

const editTodo = (e) => {
  if (e.target.classList.contains("todo-edit")) {
    const taskId = e.target.parentElement.classList[1];
    const todoText = e.target.parentElement.querySelector(".todo-text");
    if (todoText.disabled) {
      todoText.disabled = false;
      e.target.textContent = "Save";
    } else {
      todoText.disabled = true;
      e.target.textContent = "Edit";
      editTodoInLocalStorage(taskId, todoText.value);
    }
  }
};

const populateTodoList = () => {
  const storedTasks = getStoredTasks();
  storedTasks.forEach((task) => {
    renderTodo(task);
  });
};

const addTodo = (e) => {
  e.preventDefault();
  const todo = todoInput.value;
  if (todo) {
    const id = Date.now();
    const newTask = { id, todo, completed: false };
    addTodoToLocalStorage(newTask);
    renderTodo(newTask);
    todoInput.value = "";
  }
};

const getTodo = (e) => {
  populateTodoList();
};

const filterTasks = (searchText) => {
  const storedTasks = getStoredTasks();
  return storedTasks.filter((task) =>
    task.todo.toLowerCase().includes(searchText.toLowerCase())
  );
};

const displayFilteredTasks = (filteredTasks) => {
  todoOutput.innerHTML = "";
  filteredTasks.forEach((task) => renderTodo(task));
};

const searchTodo = (e) => {
  const searchText = e.target.value.trim();
  if (searchText !== "") {
    const filteredTasks = filterTasks(searchText);
    displayFilteredTasks(filteredTasks);
  } else {
    populateTodoList();
  }
};

//Event Listeners
todoForm.addEventListener("submit", addTodo);
todoOutput.addEventListener("click", deleteTodo);
todoOutput.addEventListener("click", checkedTodo);
todoOutput.addEventListener("click", editTodo);
document.addEventListener("DOMContentLoaded", getTodo);
searchInput.addEventListener("keyup", searchTodo);
