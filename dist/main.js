class TaskObject {
    id;
    name;
    priority;
    status = "pending";
    description;
    notes;
    constructor(name, priority) {
        this.id = nextId++;
        this.name = name;
        this.priority = priority;
    }
}
const tasks = {
    contents: [],
    length: 0,
    addTask(name, priority = 1, description, notes) {
        const task = new TaskObject(name, priority);
        if (description) {
            task.description = description;
        }
        if (notes) {
            task.notes = notes;
        }
        this.length = this.contents.push(task);
        this.save();
        return this.length;
    },
    deleteTask(id) {
        const index = this.contents.findIndex((task) => task.id === id);
        this.contents.splice(index, 1);
        this.length = this.contents.length;
        this.save();
    },
    getTaskById(id) {
        return this.contents.find((task) => task.id === id);
    },
    toggleStatus(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.status = task.status === "pending" ? "completed" : "pending";
        }
        this.save();
    },
    listAll() {
        return this.contents;
    },
    listCompleted() {
        return this.contents.filter((task) => task.status === "completed");
    },
    listPending() {
        return this.contents.filter((task) => task.status === "pending");
    },
    save() {
        const tasksJson = JSON.stringify(tasks.contents);
        localStorage.setItem("tasks", tasksJson);
        localStorage.setItem("nextId", nextId.toString());
        localStorage.setItem("lastSaved", Date());
    },
    load() {
        const tasksJson = localStorage.getItem("tasks");
        if (tasksJson !== null) {
            this.contents = JSON.parse(tasksJson);
        }
    },
    clear() {
        this.contents = [];
        localStorage.removeItem("tasks");
        localStorage.removeItem("nextId");
    },
};
class CardObject {
    taskId;
    rootElement;
    heading;
    status;
    priority;
    toggleStatusButton;
    editTaskButton;
    constructor(task) {
        this.taskId = task.id;
        this.rootElement = this.createRootElement();
        this.heading = this.createHeadingElement(task.name);
        this.status = this.createStatusElement(task.status);
        this.priority = this.createPriorityElement(task.priority);
        this.toggleStatusButton = this.createToggleStatusButton(task);
        this.editTaskButton = this.createEditTaskButton();
        this.addToggleStatusClickListener(task);
        this.addEditTaskClickListener();
    }
    createRootElement() {
        const rootElement = document.createElement("article");
        rootElement.className = "card | grid container";
        return rootElement;
    }
    createHeadingElement(taskName) {
        const headingElement = document.createElement("h2");
        headingElement.className = "card__heading task-name";
        headingElement.textContent = taskName;
        return headingElement;
    }
    createStatusElement(taskStatus) {
        const statusElement = document.createElement("p");
        statusElement.className = "card__status";
        statusElement.textContent = taskStatus;
        if (taskStatus === "completed") {
            this.heading.classList.add("line-through");
            this.rootElement.classList.add("opacity-50");
        }
        return statusElement;
    }
    createPriorityElement(taskPriority) {
        const priorityElement = document.createElement("p");
        priorityElement.className = "priority";
        priorityElement.textContent = `${taskPriority}`;
        priorityElement.classList.add(`priority-${taskPriority}`);
        return priorityElement;
    }
    createToggleStatusButton(task) {
        const button = document.createElement("button");
        button.id = `toggle-status-${this.taskId}`;
        button.className = "card__toggle-status icon button";
        button.textContent = `${task.status === "completed" ? "\u21b6" : "\u2714"}`;
        button.ariaLabel = `${task.status === "completed" ? "set task to pending" : "set task to completed"}`;
        return button;
    }
    createEditTaskButton() {
        const button = document.createElement("button");
        button.id = `edit-task-${this.taskId}`;
        button.className = "card__edit-task icon button";
        button.textContent = "\u270e";
        button.ariaLabel = "Edit task";
        return button;
    }
    addToggleStatusClickListener(task) {
        this.toggleStatusButton.addEventListener("click", () => {
            handleToggleStatusButtonClick(task);
        });
    }
    addEditTaskClickListener() {
        this.editTaskButton.addEventListener("click", () => {
            handleEditTaskButtonClick(this.taskId);
        });
    }
    render() {
        const rootElement = this.rootElement;
        rootElement.append(this.heading, this.status, this.priority, this.editTaskButton, this.toggleStatusButton);
        return rootElement;
    }
}
class NewTaskFormObject {
    rootElement;
    taskNameInput;
    priorityButton;
    saveButton;
    constructor() {
        this.rootElement = this.createRootElement();
        this.taskNameInput = this.createTaskNameInput();
        this.priorityButton = this.createPriorityButton();
        this.saveButton = this.createSaveButton();
        this.addPriorityClickListener();
        this.rootElement.addEventListener("submit", (e) => {
            this.handleSubmit(e);
        });
    }
    createRootElement() {
        const rootElement = document.createElement("form");
        rootElement.className = "form card | grid container";
        rootElement.dataset["type"] = "dashed-border";
        return rootElement;
    }
    createTaskNameInput() {
        const input = createLabeledInput("new-task-name", "Task name");
        input.rootElement.className = "form__input-group";
        input.input.className = "form__input task-name";
        input.label.className = "visually-hidden";
        input.input.placeholder = "New task...";
        input.input.dataset["type"] = "dashed-border";
        return input;
    }
    createPriorityButton(priority = 1) {
        const button = createButton(`${priority}`);
        button.className = "priority icon button";
        button.ariaLabel = `Change priority to ${incrementPriority(priority)}`;
        button.dataset["type"] = "dashed-border";
        return button;
    }
    createSaveButton() {
        const button = createButton("Save");
        button.type = "submit";
        button.className = "form__save button";
        button.dataset["type"] = "dashed-border";
        return button;
    }
    addPriorityClickListener() {
        this.priorityButton.addEventListener("click", () => {
            handlePriorityButtonClick(this.priorityButton);
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        const name = this.taskNameInput.input.value.trim();
        const errorMessage = validateTaskName(name);
        if (errorMessage) {
            this.taskNameInput.errorMessage.textContent = errorMessage;
            return;
        }
        const priority = toPriority(this.priorityButton.textContent);
        tasks.addTask(name, priority);
        cards.renderAll();
        document.getElementById("new-task-name")?.focus();
    }
    render() {
        const rootElement = this.rootElement;
        rootElement.append(this.taskNameInput.rootElement, this.priorityButton, this.saveButton);
        return rootElement;
    }
}
class EditTaskFormObject extends NewTaskFormObject {
    task;
    dialog;
    deleteButton;
    constructor(task) {
        super();
        this.task = task;
        this.dialog = this.createDialogElement();
        this.priorityButton = this.createPriorityButton(task.priority);
        this.deleteButton = this.createDeleteButton();
        this.taskNameInput.input.id = "edit-task-name";
        this.taskNameInput.input.value = task.name;
        this.addDeleteClickListener();
        this.addPriorityClickListener();
        this.rootElement.appendChild(this.deleteButton);
    }
    createDialogElement() {
        const dialog = document.createElement("dialog");
        return dialog;
    }
    createDeleteButton() {
        const button = createButton("\u{1F5D1}");
        button.className = "form__delete icon button";
        button.ariaLabel = "Delete task";
        return button;
    }
    handleSubmit(event) {
        event.preventDefault();
        const name = this.taskNameInput.input.value.trim();
        const errorMessage = validateTaskName(name);
        if (errorMessage) {
            this.taskNameInput.errorMessage.textContent = errorMessage;
            return;
        }
        const priority = toPriority(this.priorityButton.textContent);
        this.task.name = name;
        this.task.priority = priority;
        tasks.save();
        cards.editingTaskId = null;
        cards.renderAll();
        document.getElementById(`edit-task-${this.task.id}`)?.focus();
    }
    addDeleteClickListener() {
        this.deleteButton.addEventListener("click", () => {
            handleDeleteButtonClick(this.task.id);
        });
    }
    render() {
        const rootElement = this.rootElement;
        rootElement.append(this.taskNameInput.rootElement, this.priorityButton, this.saveButton, this.deleteButton);
        return rootElement;
    }
}
/* ======================================================================
 * Helper functions
 * ======================================================================
 */
function createButton(textContent) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = textContent;
    return button;
}
function createLabeledInput(id, labelText) {
    const group = {
        rootElement: document.createElement("div"),
        label: document.createElement("label"),
        input: document.createElement("input"),
        errorMessage: document.createElement("p"),
    };
    group.rootElement.append(group.label, group.input, group.errorMessage);
    group.input.id = id;
    group.label.htmlFor = id;
    group.label.textContent = labelText;
    group.errorMessage.classList.add("error-message");
    return group;
}
function toPriority(value) {
    if ([1, 2, 3, 4, 5].includes(+value)) {
        return value;
    }
    else {
        throw new Error(`Can not convert ${value} to type Priority.`);
    }
}
function incrementPriority(priority) {
    priority %= 5;
    priority++;
    return toPriority(priority);
}
function validateTaskName(name) {
    const errorMessage = !name
        ? "Task name is required."
        : name.length > 30
            ? "Task name should be no more than 30 characters"
            : "";
    return errorMessage;
}
function displayLastSavedDate() {
    const lastSaved = localStorage.getItem("lastSaved") ?? Date();
    const element = document.getElementById("last-saved");
    if (element) {
        element.textContent = `Last saved: ${lastSaved}`;
    }
}
/* ======================================================================
 * Event Handling
 * ======================================================================
 */
function handleToggleStatusButtonClick(task) {
    tasks.toggleStatus(task.id);
    cards.renderAll();
}
function handleEditTaskButtonClick(taskId) {
    cards.editingTaskId = taskId;
    cards.renderAll();
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
    cards.renderAll();
}
function handleClearAllButtonClick() {
    tasks.clear();
    cards.renderAll();
}
const clearAllButton = document.getElementById("clear-all");
clearAllButton?.addEventListener("click", handleClearAllButtonClick);
const cards = {
    rootElement: document.querySelector("#app"),
    editingTaskId: null,
    styleRootElement() {
        this.rootElement.classList.add("grid");
    },
    renderAll() {
        const focusId = document.activeElement?.id;
        this.rootElement.innerHTML = "";
        const cards = tasks.contents.map((task) => task.id === this.editingTaskId
            ? new EditTaskFormObject(task)
            : new CardObject(task));
        cards.forEach((card) => this.rootElement.appendChild(card.render()));
        this.rootElement.appendChild(new NewTaskFormObject().render());
        if (focusId) {
            document.getElementById(focusId)?.focus();
        }
        displayLastSavedDate();
    },
};
let nextId = +(localStorage.getItem("nextId") ?? 0);
tasks.load();
cards.styleRootElement();
cards.renderAll();
export {};
//# sourceMappingURL=main.js.map