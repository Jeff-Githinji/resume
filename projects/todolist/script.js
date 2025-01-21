// Authentication logic
const authButton = document.getElementById('auth-button');
const registerButton = document.getElementById('register-button');
const todoContainer = document.querySelector('.todo-container');
const authContainer = document.querySelector('.auth-container');

// Simple user database
let users = {};

// Login functionality
authButton.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Please fill in all fields!');
    return;
  }

  if (users[username] && users[username] === password) {
    authContainer.style.display = 'none';
    todoContainer.style.display = 'block';
  } else {
    alert('Invalid credentials!');
  }
});

// Registration functionality
registerButton.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    users[username] = password;
    alert('User registered!');
  } else {
    alert('Please fill in all fields to register.');
  }
});

// Task management functionality
const todoInput = document.getElementById('todo-input');
const addTaskButton = document.getElementById('add-task');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
let taskCount = 0;

// Priority counters
let priorityCounts = {
    High: 0,
    Medium: 0,
    Low: 0,
    Mundane: 0
};

// Add completed counter
let completedCount = 0;

function updatePriorityCounters() {
    document.getElementById('high-counter').textContent = priorityCounts.High;
    document.getElementById('medium-counter').textContent = priorityCounts.Medium;
    document.getElementById('low-counter').textContent = priorityCounts.Low;
    document.getElementById('mundane-counter').textContent = priorityCounts.Mundane;
}

function updateTaskCounter() {
  taskCounter.textContent = taskCount;
}

function updateCompletedCounter() {
    document.getElementById('completed-counter').textContent = completedCount;
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter tasks
        document.querySelectorAll('#todo-list li').forEach(task => {
            if (filter === 'all' || task.classList.contains(`priority-${filter}`)) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    });
});

// Modified addTaskButton event listener
addTaskButton.addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    const priority = document.getElementById('task-category').value;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    if (priority === '') {
        alert('Please select a priority level!');
        return;
    }

    const li = document.createElement('li');
    li.classList.add(`priority-${priority}`);
    
    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info');
    taskInfo.textContent = `${taskText}`;

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.classList.add('complete');
    completeButton.addEventListener('click', () => {
        const wasCompleted = li.classList.contains('completed');
        li.classList.toggle('completed');
        
        // Update completed counter
        if (!wasCompleted) {
            completedCount++;
        } else {
            completedCount--;
        }
        updateCompletedCounter();
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => {
        if (li.classList.contains('completed')) {
            completedCount--;
            updateCompletedCounter();
        }
        const priority = li.className.split(' ')
            .find(cls => cls.startsWith('priority-'))
            .replace('priority-', '');
        
        priorityCounts[priority]--;
        updatePriorityCounters();
        todoList.removeChild(li);
        taskCount--;
        updateTaskCounter();
    });

    actionsDiv.appendChild(completeButton);
    actionsDiv.appendChild(deleteButton);
    li.appendChild(taskInfo);
    li.appendChild(actionsDiv);
    todoList.appendChild(li);

    taskCount++;
    updateTaskCounter();

    priorityCounts[priority]++;
    updatePriorityCounters();

    todoInput.value = '';
});

// Press 'Enter' to add task
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTaskButton.click();
  }
});

// Logout functionality
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
    authContainer.style.display = 'flex';
    todoContainer.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Reset all counters when logging out
    taskCount = 0;
    priorityCounts = {
        High: 0,
        Medium: 0,
        Low: 0,
        Mundane: 0
    };
    updateTaskCounter();
    updatePriorityCounters();
    
    // Clear the todo list
    todoList.innerHTML = '';
    completedCount = 0;
    updateCompletedCounter();
});
