import { tasks } from "./tasks.js";
import { CardObject } from "./cards.js";
import { NewTaskFormObject } from "./new-task-form.js";
import { EditTaskFormObject } from "./edit-task-form.js";
import { toPriority, incrementPriority, validateTaskName } from "./utils.js";
export const app = {
    rootElement: document.querySelector("#app"),
    editingTaskId: null,
    styleRootElement() {
        this.rootElement.classList.add("grid");
    },
    renderCard(task) {
        const card = new CardObject(task);
        addToggleStatusClickListener(task, card);
        addEditTaskClickListener(task, card);
        this.rootElement.appendChild(card.render());
    },
    renderNewTaskForm() {
        const form = new NewTaskFormObject();
        addPriorityClickListener(form);
        addFormSubmitListener(form);
        this.rootElement.appendChild(form.render());
    },
    renderEditTaskForm(task) {
        const form = new EditTaskFormObject(task);
        addPriorityClickListener(form);
        addFormSubmitListener(form);
        addDeleteClickListener(form);
        this.rootElement.appendChild(form.render());
    },
    renderTasks(tasks) {
        tasks
            .listAll()
            .forEach((task) => task.id === this.editingTaskId
            ? this.renderEditTaskForm(task)
            : this.renderCard(task));
    },
    renderLastSavedDate() {
        const lastSaved = localStorage.getItem("lastSaved") ?? Date();
        const element = document.getElementById("last-saved");
        if (element) {
            element.textContent = `Last saved: ${lastSaved}`;
        }
    },
    renderAll() {
        const focusId = document.activeElement?.id;
        this.rootElement.innerHTML = "";
        this.renderTasks(tasks);
        this.renderNewTaskForm();
        this.renderLastSavedDate();
        if (focusId) {
            document.getElementById(focusId)?.focus();
        }
    },
};
function handleClearAllButtonClick() {
    tasks.clear();
    app.renderAll();
}
/* ======================================================================
 * Event listeners.
 * ======================================================================
 */
const clearAllButton = document.getElementById("clear-all");
clearAllButton?.addEventListener("click", handleClearAllButtonClick);
function addToggleStatusClickListener(task, card) {
    card.toggleStatusButton.addEventListener("click", () => {
        handleToggleStatusButtonClick(task);
    });
}
function addEditTaskClickListener(task, card) {
    card.editTaskButton.addEventListener("click", () => {
        handleEditTaskButtonClick(task);
    });
}
function addPriorityClickListener(form) {
    form.priorityButton.addEventListener("click", () => {
        handlePriorityButtonClick(form.priorityButton);
    });
}
function addFormSubmitListener(form) {
    form.rootElement.addEventListener("submit", (e) => {
        handleSubmit(e, form);
    });
}
function addDeleteClickListener(form) {
    form.deleteButton.addEventListener("click", () => {
        handleDeleteButtonClick(form.task.id);
    });
}
/* ======================================================================
 * Event handlers.
 * ======================================================================
 */
function handleToggleStatusButtonClick(task) {
    tasks.toggleStatus(task.id);
    app.renderAll();
}
function handleEditTaskButtonClick(task) {
    app.editingTaskId = task.id;
    app.renderAll();
    document.getElementById("edit-task-name")?.focus();
}
function handlePriorityButtonClick(button) {
    let priority = toPriority(button.textContent);
    priority = incrementPriority(priority);
    button.textContent = `${priority}`;
    button.ariaLabel = `Change priority to ${incrementPriority(priority)}`;
}
function handleDeleteButtonClick(taskId) {
    tasks.deleteTask(taskId);
    app.renderAll();
}
function handleSubmit(event, form) {
    event.preventDefault();
    const name = form.taskNameInput.input.value.trim();
    const errorMessage = validateTaskName(name);
    if (errorMessage) {
        form.taskNameInput.errorMessage.textContent = errorMessage;
        return;
    }
    const priority = toPriority(form.priorityButton.textContent);
    if (form instanceof EditTaskFormObject) {
        tasks.editTask(form.task.id, name, priority);
        app.editingTaskId = null;
        app.renderAll();
        document.getElementById(`edit-task-${form.task.id}`)?.focus();
    }
    else {
        tasks.addTask(name, priority);
        app.renderAll();
        document.getElementById("new-task-name")?.focus();
    }
}
//# sourceMappingURL=render.js.map