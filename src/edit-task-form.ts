import type { Task, EditTaskForm } from "./types.js";
import { NewTaskFormObject, createButton } from "./new-task-form.js";

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
    this.rootElement.classList.add("edit-task");
    this.taskNameInput.input.id = "edit-task-name";
    this.taskNameInput.input.value = task.name;
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
