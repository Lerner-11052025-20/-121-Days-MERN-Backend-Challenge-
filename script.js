// Task Manager Class
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.init();
    }
    // code

    init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.render();
    }

    cacheDOMElements() {
        this.form = document.getElementById('addTaskForm');
        this.taskInput = document.getElementById('taskInput');
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        
        // Stats
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.allCountEl = document.getElementById('allCount');
        this.activeCountEl = document.getElementById('activeCount');
        this.completedCountEl = document.getElementById('completedCount');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleAddTask(e));
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterChange(e));
        });
    }

    handleAddTask(e) {
        e.preventDefault();
        const text = this.taskInput.value.trim();
        
        if (!text) return;

        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.render();
        
        // Add subtle animation feedback
        this.taskInput.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.taskInput.style.transform = 'scale(1)';
        }, 100);
    }

    handleFilterChange(e) {
        const filter = e.currentTarget.dataset.filter;
        this.currentFilter = filter;
        
        this.filterTabs.forEach(tab => tab.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.add('removing');
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.saveTasks();
                this.render();
            }, 300);
        }
    }

    startEdit(id) {
        this.editingTaskId = id;
        this.render();
        
        // Focus the edit input
        setTimeout(() => {
            const editInput = document.querySelector('.edit-input');
            if (editInput) {
                editInput.focus();
                editInput.select();
            }
        }, 0);
    }

    saveEdit(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
        }
        this.editingTaskId = null;
        this.render();
    }

    cancelEdit() {
        this.editingTaskId = null;
        this.render();
    }

    clearCompleted() {
        const completedTasks = this.tasks.filter(t => t.completed);
        
        if (completedTasks.length === 0) return;

        if (confirm(`Delete ${completedTasks.length} completed task${completedTasks.length > 1 ? 's' : ''}?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
        }
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    getStats() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            active: this.tasks.filter(t => !t.completed).length
        };
    }

    updateStats() {
        const stats = this.getStats();
        
        this.totalTasksEl.textContent = stats.total;
        this.completedTasksEl.textContent = stats.completed;
        this.allCountEl.textContent = stats.total;
        this.activeCountEl.textContent = stats.active;
        this.completedCountEl.textContent = stats.completed;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}${this.editingTaskId === task.id ? ' editing' : ''}`;
        li.dataset.id = task.id;

        const isEditing = this.editingTaskId === task.id;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="taskManager.toggleTask('${task.id}')"
            >
            <div class="task-content">
                ${isEditing ? `
                    <input 
                        type="text" 
                        class="edit-input" 
                        value="${this.escapeHtml(task.text)}"
                        onblur="taskManager.saveEdit('${task.id}', this.value)"
                        onkeydown="if(event.key === 'Enter') this.blur(); if(event.key === 'Escape') taskManager.cancelEdit();"
                    >
                ` : `
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <span class="task-time">${this.formatDate(task.createdAt)}</span>
                `}
            </div>
            <div class="task-actions">
                ${!isEditing ? `
                    <button class="task-btn edit-btn" onclick="taskManager.startEdit('${task.id}')" title="Edit task">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                ` : ''}
                <button class="task-btn delete-btn" onclick="taskManager.deleteTask('${task.id}')" title="Delete task">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        
        this.tasksList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
            filteredTasks.forEach(task => {
                this.tasksList.appendChild(this.createTaskElement(task));
            });
        }

        this.updateStats();
    }

    saveTasks() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('taskflow_tasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the app
let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});
