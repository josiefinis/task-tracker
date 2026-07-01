import type { Task, TaskId, Status, Priority, Card } from "./types.js";
import { tasks } from "./tasks.js";
import { cards } from "./render.js";

export class CardObject implements Card {
  taskId: TaskId;
  rootElement: HTMLElement;
  heading: HTMLHeadingElement;
  status: HTMLParagraphElement;
  priority: HTMLParagraphElement;
  toggleStatusButton: HTMLButtonElement;
  editTaskButton: HTMLButtonElement;

  constructor(task: Task) {
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

  createRootElement(): HTMLElement {
    const rootElement = document.createElement("article");
    rootElement.className = "card | grid container";
    return rootElement;
  }

  createHeadingElement(taskName: string): HTMLHeadingElement {
    const headingElement = document.createElement("h2");
    headingElement.className = "card__heading task-name";
    headingElement.textContent = taskName;
    return headingElement;
  }

  createStatusElement(taskStatus: Status): HTMLParagraphElement {
    const statusElement = document.createElement("p");
    statusElement.className = "card__status";
    statusElement.textContent = taskStatus;
    if (taskStatus === "completed") {
      this.heading.classList.add("line-through");
      this.rootElement.classList.add("opacity-50");
    }
    return statusElement;
  }

  createPriorityElement(taskPriority: Priority): HTMLParagraphElement {
    const priorityElement = document.createElement("p");
    priorityElement.className = "priority";
    priorityElement.textContent = `${taskPriority}`;
    priorityElement.classList.add(`priority-${taskPriority}`);
    return priorityElement;
  }

  createToggleStatusButton(task: Task): HTMLButtonElement {
    const button = document.createElement("button");
    button.id = `toggle-status-${this.taskId}`;
    button.className = "card__toggle-status icon button";
    button.textContent = `${task.status === "completed" ? "\u21b6" : "\u2714"}`;
    button.ariaLabel = `${task.status === "completed" ? "set task to pending" : "set task to completed"}`;

    return button;
  }
  createEditTaskButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.id = `edit-task-${this.taskId}`;
    button.className = "card__edit-task icon button";
    button.textContent = "\u270e";
    button.ariaLabel = "Edit task";

    return button;
  }

  addToggleStatusClickListener(task: Task): void {
    this.toggleStatusButton.addEventListener("click", () => {
      handleToggleStatusButtonClick(task);
    });
  }

  addEditTaskClickListener(): void {
    this.editTaskButton.addEventListener("click", () => {
      handleEditTaskButtonClick(this.taskId);
    });
  }

  render(): HTMLElement {
    const rootElement = this.rootElement;
    rootElement.append(
      this.heading,
      this.status,
      this.priority,
      this.editTaskButton,
      this.toggleStatusButton,
    );
    return rootElement;
  }
}

function handleToggleStatusButtonClick(task: Task): void {
  tasks.toggleStatus(task.id);
  cards.renderAll();
}

function handleEditTaskButtonClick(taskId: TaskId): void {
  cards.editingTaskId = taskId;
  cards.renderAll();
  document.getElementById("edit-task-name")?.focus();
}
