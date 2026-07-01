import type { Task, TaskId, EditTaskForm } from "./types.js";
import { NewTaskFormObject, createButton } from "./new-task-form.js";
import { validateTaskName, toPriority } from "./utils.js";
import { tasks } from "./tasks.js";
import { cards } from "./render.js";

export class EditTaskFormObject
  extends NewTaskFormObject
  implements EditTaskForm
{
  task: Task;
  dialog: HTMLDialogElement;
  deleteButton: HTMLButtonElement;

  constructor(task: Task) {
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

  createDialogElement(): HTMLDialogElement {
    const dialog = document.createElement("dialog");
    return dialog;
  }

  createDeleteButton(): HTMLButtonElement {
    const button = createButton("\u{1F5D1}");
    button.className = "form__delete icon button";
    button.ariaLabel = "Delete task";

    return button;
  }

  override handleSubmit(event: Event): void {
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

  addDeleteClickListener(): void {
    this.deleteButton.addEventListener("click", () => {
      handleDeleteButtonClick(this.task.id);
    });
  }

  override render(): HTMLElement {
    const rootElement = this.rootElement;
    rootElement.append(
      this.taskNameInput.rootElement,
      this.priorityButton,
      this.saveButton,
      this.deleteButton,
    );
    return rootElement;
  }
}

function handleDeleteButtonClick(taskId: TaskId): void {
  tasks.deleteTask(taskId);
  cards.renderAll();
}
