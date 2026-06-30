/* ======================================================================
 * Tasks
 * ======================================================================
 */
type TaskId = number;
type Priority = 1 | 2 | 3 | 4 | 5;
type Status = "pending" | "completed";

interface Task {
  id: TaskId;
  name: string;
  priority: Priority;
  status: Status;
  description?: string;
  notes?: string;
}

interface TaskList {
  contents: Task[];
  length: number;

  addTask(
    name: string,
    priority?: Priority,
    description?: string,
    notes?: string,
  ): number;
  deleteTask(id: TaskId): void;
  getTaskById(id: TaskId): Task | undefined;
  toggleStatus(id: TaskId): void;
  listAll(): Task[];
  listCompleted(): Task[];
  listPending(): Task[];
  save(): void;
  load(): void;
  clear(): void;
}

class TaskObject implements Task {
  id: TaskId;
  name: string;
  priority: Priority;
  status: Status = "pending";
  description?: string;
  notes?: string;

  constructor(name: string, priority: Priority) {
    this.id = nextId++;
    this.name = name;
    this.priority = priority;
  }
}

const tasks: TaskList = {
  contents: [],
  length: 0,

  addTask(
    name: string,
    priority: Priority = 1,
    description?: string,
    notes?: string,
  ): number {
    const task: Task = new TaskObject(name, priority);
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

  deleteTask(id: TaskId): void {
    const index = this.contents.findIndex((task) => task.id === id);
    this.contents.splice(index, 1);
    this.length = this.contents.length;
    this.save();
  },

  getTaskById(id: TaskId): Task | undefined {
    return this.contents.find((task) => task.id === id);
  },

  toggleStatus(id: TaskId): void {
    const task: Task | undefined = this.getTaskById(id);
    if (task) {
      task.status = task.status === "pending" ? "completed" : "pending";
    }
    this.save();
  },

  listAll(): Task[] {
    return this.contents;
  },

  listCompleted(): Task[] {
    return this.contents.filter((task) => task.status === "completed");
  },

  listPending(): Task[] {
    return this.contents.filter((task) => task.status === "pending");
  },

  save(): void {
    const tasksJson = JSON.stringify(tasks.contents);
    localStorage.setItem("tasks", tasksJson);
    localStorage.setItem("nextId", nextId.toString());
    localStorage.setItem("lastSaved", Date());
  },

  load(): void {
    const tasksJson: string | null = localStorage.getItem("tasks");
    if (tasksJson !== null) {
      this.contents = JSON.parse(tasksJson) as Task[];
    }
  },

  clear(): void {
    this.contents = [];
    localStorage.removeItem("tasks");
    localStorage.removeItem("nextId");
  },
};

/* ======================================================================
 * Render Tasks as Cards
 * ======================================================================
 */
interface Card {
  taskId: TaskId;
  rootElement: HTMLElement;
  heading: HTMLHeadingElement;
  status: HTMLParagraphElement;
  priority: HTMLParagraphElement;
  toggleStatusButton: HTMLButtonElement;
  editTaskButton: HTMLButtonElement;

  createRootElement(): HTMLElement;
  createHeadingElement(taskName: string): HTMLHeadingElement;
  createStatusElement(taskStatus: Status): HTMLParagraphElement;
  createPriorityElement(taskPriority: Priority): HTMLParagraphElement;
  createToggleStatusButton(task: Task): HTMLButtonElement;
  createEditTaskButton(): HTMLButtonElement;
  addToggleStatusClickListener(task: Task): void;
  addEditTaskClickListener(): void;
  render(): HTMLElement;
}

interface NewTaskForm {
  rootElement: HTMLFormElement;
  taskNameInput: LabeledInput;
  priorityButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;

  createRootElement(): HTMLFormElement;
  createTaskNameInput(): LabeledInput;
  createPriorityButton(priority?: Priority): HTMLButtonElement;
  createSaveButton(): HTMLButtonElement;
  addPriorityClickListener(): void;
  handleSubmit(event: Event): void;
  render(): HTMLElement;
}

interface EditTaskForm extends NewTaskForm {
  task: Task;
  dialog: HTMLDialogElement;
  deleteButton: HTMLButtonElement;

  createDialogElement(): HTMLDialogElement;
  createDeleteButton(): HTMLButtonElement;
  addDeleteClickListener(): void;
}

interface LabeledInput {
  rootElement: HTMLDivElement;
  label: HTMLLabelElement;
  input: HTMLInputElement;
  errorMessage: HTMLParagraphElement;
}

class CardObject implements Card {
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

class NewTaskFormObject implements NewTaskForm {
  rootElement: HTMLFormElement;
  taskNameInput: LabeledInput;
  priorityButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;

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

  addPriorityClickListener(): void {
    this.priorityButton.addEventListener("click", () => {
      handlePriorityButtonClick(this.priorityButton);
    });
  }

  handleSubmit(event: Event): void {
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

class EditTaskFormObject extends NewTaskFormObject implements EditTaskForm {
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

/* ======================================================================
 * Helper functions
 * ======================================================================
 */
function createButton(textContent: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = textContent;
  return button;
}

function createLabeledInput(id: string, labelText: string): LabeledInput {
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

function toPriority(value: string | number): Priority {
  if ([1, 2, 3, 4, 5].includes(+value)) {
    return value as Priority;
  } else {
    throw new Error(`Can not convert ${value} to type Priority.`);
  }
}

function incrementPriority(priority: Priority): Priority {
  priority %= 5;
  priority++;
  return toPriority(priority);
}

function validateTaskName(name: string): string {
  const errorMessage: string = !name
    ? "Task name is required."
    : name.length > 30
      ? "Task name should be no more than 30 characters"
      : "";
  return errorMessage;
}

function displayLastSavedDate(): void {
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
function handleToggleStatusButtonClick(task: Task): void {
  tasks.toggleStatus(task.id);
  cards.renderAll();
}

function handleEditTaskButtonClick(taskId: TaskId): void {
  cards.editingTaskId = taskId;
  cards.renderAll();
  document.getElementById("edit-task-name")?.focus();
}

function handlePriorityButtonClick(button: HTMLButtonElement) {
  let priority = toPriority(button.textContent);
  priority = incrementPriority(priority);
  button.textContent = `${priority}`;
  button.ariaLabel = `Change priority to ${incrementPriority(priority)}`;
}

function handleDeleteButtonClick(taskId: TaskId): void {
  tasks.deleteTask(taskId);
  cards.renderAll();
}

function handleClearAllButtonClick(): void {
  tasks.clear();
  cards.renderAll();
}

const clearAllButton = document.getElementById("clear-all");
clearAllButton?.addEventListener("click", handleClearAllButtonClick);

/* ======================================================================
 * Rendering
 * ======================================================================
 */
interface CardLayout {
  rootElement: HTMLDivElement;
  editingTaskId: TaskId | null;

  styleRootElement(): void;
  renderAll(): void;
}

const cards: CardLayout = {
  rootElement: document.querySelector("#app") as HTMLDivElement,
  editingTaskId: null,

  styleRootElement(): void {
    this.rootElement.classList.add("grid");
  },

  renderAll(): void {
    const focusId: string | undefined = document.activeElement?.id;
    this.rootElement.innerHTML = "";
    const cards = tasks.contents.map((task) =>
      task.id === this.editingTaskId
        ? new EditTaskFormObject(task)
        : new CardObject(task),
    );
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
