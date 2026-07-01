export class CardObject {
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
    render() {
        const rootElement = this.rootElement;
        rootElement.append(this.heading, this.status, this.priority, this.editTaskButton, this.toggleStatusButton);
        return rootElement;
    }
}
//# sourceMappingURL=cards.js.map