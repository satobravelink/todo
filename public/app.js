const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const countEl = document.getElementById('todo-count');
const filterButtons = document.querySelectorAll('.filter');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(title) {
  const todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  saveTodos();
  render();
}

function toggleTodo(id, completed) {
  todos = todos.map((t) => (t.id === id ? { ...t, completed } : t));
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function filteredTodos() {
  if (currentFilter === 'active') return todos.filter((t) => !t.completed);
  if (currentFilter === 'completed') return todos.filter((t) => t.completed);
  return todos;
}

function render() {
  const visible = filteredTodos();
  list.innerHTML = '';

  visible.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id, !todo.completed));

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = todo.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, title, deleteBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter((t) => !t.completed).length;
  countEl.textContent = `${remaining} 件の未完了タスク`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (title) {
    addTodo(title);
    input.value = '';
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
