const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#todo-count");
const clearCompletedButton = document.querySelector("#clear-completed");

const STORAGE_KEY = "my-first-project-todos";

let todos = loadTodos();

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function updateCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;

  if (todos.length === 0) {
    count.textContent = "还没有待办事项";
    return;
  }

  count.textContent = `还剩 ${remaining} 项待完成`;
}

function renderTodos() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = todo.completed ? "todo-item completed" : "todo-item";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    label.append(checkbox, text);
    item.append(label, deleteButton);
    list.append(item);
  });

  updateCount();
}

function addTodo(text) {
  todos.push({
    id: createId(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  addTodo(text);
  form.reset();
  input.focus();
});

clearCompletedButton.addEventListener("click", clearCompleted);

renderTodos();
