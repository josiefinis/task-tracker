import type { NewTaskForm, LabeledInput, Priority } from "./types.js";
import { incrementPriority } from "./utils.js";

export class NewTaskFormObject implements NewTaskForm {
  rootElement: HTMLFormElement;
  taskNameInput: LabeledInput;
  priorityButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;

  constructor() {
    this.rootElement = this.createRootElement();
    this.taskNameInput = this.createTaskNameInput();
    this.priorityButton = this.createPriorityButton();
    this.saveButton = this.createSaveButton();
  }

  createRootElement(): HTMLFormElement {
    const rootElement = document.createElement("form");
    rootElement.className = "form card | grid container";
    rootElement.dataset["type"] = "dashed-border";
    return rootElement;
  }

  createTaskNameInput(): LabeledInput {
    const input = createLabeledInput("new-task-name", "Task name");
    input.rootElement.className = "form__input-group";
    input.input.className = "form__input task-name";
    input.label.className = "visually-hidden";
    input.input.placeholder = "New task...";
    input.input.dataset["type"] = "dashed-border";
    return input;
  }

  createPriorityButton(priority: Priority = 1): HTMLButtonElement {
    const button: HTMLButtonElement = createButton(`${priority}`);
    button.className = "priority icon button";
    button.ariaLabel = `Change priority to ${incrementPriority(priority)}`;
    button.dataset["type"] = "dashed-border";
    return button;
  }

  createSaveButton(): HTMLButtonElement {
    const button = createButton("Save");
    button.type = "submit";
    button.className = "form__save button";
    button.dataset["type"] = "dashed-border";

    return button;
  }

  render(): HTMLElement {
    const rootElement = this.rootElement;
    rootElement.append(
      this.taskNameInput.rootElement,
      this.priorityButton,
      this.saveButton,
    );
    return rootElement;
  }
}

export function createButton(textContent: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = textContent;
  return button;
}

export function createLabeledInput(
  id: string,
  labelText: string,
): LabeledInput {
  const group: LabeledInput = {
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
