let counter = 0;
class TaskObject {
    id;
    name;
    priority;
    status = "pending";
    isEditing;
    constructor(name, priority) {
        this.id = counter++;
        this.name = name;
        this.priority = priority;
        this.isEditing = false;
    }
    toggleStatus() {
        this.status = this.status === "pending" ? "completed" : "pending";
        return this.status;
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
        return this.length;
    },
    deleteTask(id) {
        const index = this.contents.findIndex((task) => task.id === id);
        this.contents.splice(index, 1);
    },
    toggleStatus(id) {
        const task = this.contents.find((task) => task.id === id);
        return task ? task.toggleStatus() : undefined;
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
};
tasks.addTask("meet with CTO", 5);
tasks.addTask("client lunch", 3, "", "lights");
tasks.addTask("investors call");
tasks.addTask("give keynote", 4);
tasks.addTask("board meeting", 4);
tasks.addTask("book flights", 2);
/* ======================================================================
 * Element Creation
 * ======================================================================
 */
function createButton(textContent) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = textContent;
    return button;
}
function createPriorityButton(priority) {
    const button = createButton(`${priority}`);
    button.priority = priority;
    button.className = "priority icon button";
    button.ariaLabel = `Change priority to ${(priority % 5) + 1}`;
    button.addEventListener("click", () => {
        priority = (1 + (priority % 5));
        button.priority = priority;
        button.textContent = `${button.priority}`;
        button.ariaLabel = `Change priority to ${(priority % 5) + 1}`;
    });
    return button;
}
function createLabeledInput(id, labelText) {
    const group = {
        renderable: document.createElement("div"),
        label: document.createElement("label"),
        input: document.createElement("input"),
    };
    group.renderable.append(group.label, group.input);
    group.input.id = id;
    group.label.htmlFor = id;
    group.label.textContent = labelText;
    return group;
}
function createNewTaskForm() {
    const form = {
        renderable: document.createElement("div"),
        taskName: createLabeledInput("task-name", "Task name"),
        priorityButton: createPriorityButton(1),
        saveButton: createButton("Save"),
    };
    form.taskName.input.placeholder = "New task...";
    form.renderable.className = "form card | grid container";
    form.taskName.renderable.className = "form__input-group";
    form.taskName.input.className = "form__input task-name";
    form.taskName.label.className = "visually-hidden";
    form.saveButton.className = "form__save button";
    form.saveButton.addEventListener("click", () => {
        handleSaveTask(form.taskName.input.value, form.priorityButton.priority);
    });
    setDashedBorderStyle(form);
    form.renderable.append(form.taskName.renderable, form.priorityButton, form.saveButton);
    return form;
}
function createEditTaskForm(task) {
    const form = {
        renderable: document.createElement("div"),
        dialog: document.createElement("dialog"),
        taskName: createLabeledInput("task-name", "Task name"),
        priorityButton: createPriorityButton(task.priority),
        saveButton: createButton("Save"),
        deleteButton: createButton("\u{1F5D1}"),
    };
    form.renderable.className = "form card | grid container";
    form.taskName.renderable.className = "form__input-group";
    form.taskName.input.className = "form__input task-name";
    form.taskName.label.className = "visually-hidden";
    form.saveButton.className = "form__save button";
    form.deleteButton.className = "form__delete icon button";
    form.taskName.input.value = task.name;
    form.deleteButton.ariaLabel = "Delete task";
    form.deleteButton.addEventListener("click", () => {
        tasks.deleteTask(task.id);
        renderAll();
    });
    form.saveButton.ariaLabel = "Save task";
    form.saveButton.addEventListener("click", () => {
        handleSaveTask(form.taskName.input.value, form.priorityButton.priority, task);
    });
    setDashedBorderStyle(form);
    form.renderable.append(form.taskName.renderable, form.priorityButton, form.saveButton, form.deleteButton);
    return form;
}
function createCard(task) {
    let card = {
        renderable: document.createElement("article"),
        heading: document.createElement("h2"),
        priority: document.createElement("p"),
        status: document.createElement("p"),
        toggleStatus: document.createElement("button"),
        editTask: document.createElement("button"),
    };
    card.renderable.className = "card | grid container";
    card.heading.className = "card__heading task-name";
    card.priority.className = "priority";
    card.status.className = "card__status";
    card.toggleStatus.className = "card__toggle-status icon button";
    card.editTask.className = "card__edit-task icon button";
    card.heading.textContent = task.name;
    card.priority.textContent = `${task.priority}`;
    card.status.textContent = task.status;
    card.toggleStatus.textContent = `${task.status === "completed" ? "\u21b6" : "\u2714"}`;
    card.toggleStatus.ariaLabel = `${task.status === "completed" ? "set task to pending" : "set task to completed"}`;
    card.toggleStatus.addEventListener("click", () => {
        handleToggleStatusClick(task, card);
        card.toggleStatus.focus();
    });
    card.editTask.textContent = "\u270e";
    card.editTask.ariaLabel = "Edit task";
    card.editTask.addEventListener("click", () => {
        task.isEditing = true;
        renderAll();
        document.getElementById("task-name")?.focus();
    });
    card = applyConditionalStyles(card, task);
    card.renderable.append(card.heading, card.status, card.priority, card.editTask, card.toggleStatus);
    return card;
}
/* ======================================================================
 * Element Styling
 * ======================================================================
 */
function applyConditionalStyles(card, task) {
    if (task.status === "completed") {
        card.heading.classList.add("line-through");
        card.renderable.classList.add("subtle-text");
    }
    card.priority.classList.add(`priority-${task.priority}`);
    return card;
}
function setDashedBorderStyle(form) {
    form.renderable.dataset["type"] = "dashed-border";
    form.taskName.input.dataset["type"] = "dashed-border";
    form.priorityButton.dataset["type"] = "dashed-border";
    form.saveButton.dataset["type"] = "dashed-border";
}
/* ======================================================================
 * Event Handling
 * ======================================================================
 */
function handleToggleStatusClick(task, card) {
    task.toggleStatus();
    if (!app) {
        return;
    }
    const updatedCard = createCard(task);
    app.replaceChild(updatedCard.renderable, card.renderable);
    updatedCard.toggleStatus.focus();
}
function handleSaveTask(taskName, priority, task) {
    const name = taskName.trim();
    if (!name) {
        return;
    }
    if (task) {
        task.name = name;
        task.priority = priority;
        task.isEditing = false;
    }
    else {
        tasks.addTask(name, priority);
    }
    renderAll();
    document.getElementById("task-name")?.focus();
}
function renderAll() {
    renderCards();
    renderNewCardForm();
}
function renderCards() {
    if (!app) {
        return;
    }
    app.innerHTML = "";
    const cards = tasks.contents.map((task) => task.isEditing ? createEditTaskForm(task) : createCard(task));
    cards.forEach((card) => app.appendChild(card.renderable));
}
function renderNewCardForm() {
    if (!app) {
        return;
    }
    const form = createNewTaskForm();
    app.appendChild(form.renderable);
}
const app = document.querySelector("#app");
app?.classList.add("grid");
renderAll();
export {};
//# sourceMappingURL=main.js.map