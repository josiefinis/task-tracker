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

  toggleStatus(): Status;
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
  toggleStatus(id: TaskId): Status | undefined;
  listAll(): Task[];
  listCompleted(): Task[];
  listPending(): Task[];
}

let counter = 0;

class TaskObject implements Task {
  id: TaskId;
  name: string;
  priority: Priority;
  status: Status = "pending";

  constructor(name: string, priority: Priority) {
    this.id = counter++;
    this.name = name;
    this.priority = priority;
  }

  toggleStatus(): Status {
    this.status = this.status === "pending" ? "completed" : "pending";
    return this.status;
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
    return this.length;
  },

  deleteTask(id: TaskId): void {
    const index = this.contents.findIndex((task) => task.id === id);
    this.contents.splice(index, 1);
  },

  getTaskById(id: TaskId): Task | undefined {
    return this.contents.find((task) => task.id === id);
  },

  toggleStatus(id: TaskId): Status | undefined {
    const task: Task | undefined = this.contents.find((task) => task.id === id);
    return task ? task.toggleStatus() : undefined;
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
};

/* ======================================================================
 * Create some tasks for demonstration purposes. */
tasks.addTask("meet with CTO", 5);
tasks.addTask("client lunch", 3, "", "lights");
tasks.addTask("investors call");
tasks.addTask("give keynote", 4);
tasks.addTask("board meeting", 4);
tasks.addTask("book flights", 2);
/* ======================================================================
 */

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
  render(): HTMLElement;
}

interface NewTaskForm {
  rootElement: HTMLDivElement;
  taskNameInput: LabeledInput;
  priorityButton: PriorityButton;
  saveButton: HTMLButtonElement;

  createRootElement(): HTMLDivElement;
  createTaskNameInput(): LabeledInput;
  createPriorityButton(priority?: Priority): PriorityButton;
  createSaveButton(): HTMLButtonElement;
  render(): HTMLElement;
}

interface EditTaskForm extends NewTaskForm {
  task: Task;
  dialog: HTMLDialogElement;
  deleteButton: HTMLButtonElement;

  createDialogElement(): HTMLDialogElement;
  createDeleteButton(): HTMLButtonElement;
}

interface LabeledInput {
  rootElement: HTMLDivElement;
  label: HTMLLabelElement;
  input: HTMLInputElement;
}

interface PriorityButton extends HTMLButtonElement {
  priority?: Priority;
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
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement("article");
    rootElement.className = "card | grid container";

    return rootElement;
  }

  createHeadingElement(taskName: string): HTMLHeadingElement {
    const heading = document.createElement("h2");
    heading.className = "card__heading task-name";
    heading.textContent = taskName;
    return heading;
  }

  createStatusElement(taskStatus: Status): HTMLParagraphElement {
    const element = document.createElement("p");
    element.className = "card__status";
    element.textContent = taskStatus;
    if (taskStatus === "completed") {
      this.heading.classList.add("line-through");
      this.rootElement.classList.add("subtle-text");
    }
    return element;
  }

  createPriorityElement(taskPriority: Priority): HTMLParagraphElement {
    const element = document.createElement("p");
    element.className = "priority";
    element.textContent = `${taskPriority}`;
    element.classList.add(`priority-${taskPriority}`);
    return element;
  }

  createToggleStatusButton(task: Task): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "card__toggle-status icon button";
    button.textContent = `${task.status === "completed" ? "\u21b6" : "\u2714"}`;
    button.ariaLabel = `${task.status === "completed" ? "set task to pending" : "set task to completed"}`;

    button.addEventListener("click", () => {
      handleToggleStatusButtonClick(task, this);
    });

    return button;
  }
  createEditTaskButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "card__edit-task icon button";
    button.textContent = "\u270e";
    button.ariaLabel = "Edit task";
    button.addEventListener("click", () => {
      handleEditTaskButtonClick(this.taskId);
    });

    return button;
  }

  render(): HTMLElement {
    const element = this.rootElement;
    element.append(
      this.heading,
      this.status,
      this.priority,
      this.editTaskButton,
      this.toggleStatusButton,
    );
    return element;
  }
}

class NewTaskFormObject implements NewTaskForm {
  rootElement: HTMLDivElement;
  taskNameInput: LabeledInput;
  priorityButton: PriorityButton;
  saveButton: HTMLButtonElement;

  constructor() {
    this.rootElement = this.createRootElement();
    this.taskNameInput = this.createTaskNameInput();
    this.priorityButton = this.createPriorityButton();
    this.saveButton = this.createSaveButton();
  }

  createRootElement(): HTMLDivElement {
    const rootElement = document.createElement("div");
    rootElement.className = "form card | grid container";
    rootElement.dataset["type"] = "dashed-border";
    return rootElement;
  }

  createTaskNameInput(): LabeledInput {
    const taskNameInput = createLabeledInput("task-name", "Task name");
    taskNameInput.rootElement.className = "form__input-group";
    taskNameInput.input.className = "form__input task-name";
    taskNameInput.label.className = "visually-hidden";
    taskNameInput.input.placeholder = "New task...";
    taskNameInput.input.dataset["type"] = "dashed-border";
    return taskNameInput;
  }

  createPriorityButton(priority: Priority = 1): PriorityButton {
    const button: PriorityButton = createButton(`${priority}`);
    button.priority = priority;
    button.className = "priority icon button";
    button.ariaLabel = `Change priority to ${(priority % 5) + 1}`;
    button.dataset["type"] = "dashed-border";

    button.addEventListener("click", () => {
      handlePriorityButtonClick(priority, button);
    });

    return button;
  }

  createSaveButton(): HTMLButtonElement {
    const saveButton = createButton("Save");
    saveButton.className = "form__save button";
    saveButton.dataset["type"] = "dashed-border";

    saveButton.addEventListener("click", () => {
      handleSaveButtonClick(this);
    });

    return saveButton;
  }

  render(): HTMLElement {
    const element = this.rootElement;
    element.append(
      this.taskNameInput.rootElement,
      this.priorityButton,
      this.saveButton,
    );
    return element;
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
    this.taskNameInput.input.value = task.name;

    this.rootElement.appendChild(this.deleteButton);
  }

  createDialogElement(): HTMLDialogElement {
    const dialogElement = document.createElement("dialog");
    return dialogElement;
  }

  createDeleteButton(): HTMLButtonElement {
    const deleteButton = createButton("\u{1F5D1}");
    deleteButton.className = "form__delete icon button";
    deleteButton.ariaLabel = "Delete task";

    deleteButton.addEventListener("click", () => {
      handleDeleteButtonClick(this.task.id);
    });

    return deleteButton;
  }

  override render(): HTMLElement {
    const element = this.rootElement;
    element.append(
      this.taskNameInput.rootElement,
      this.priorityButton,
      this.saveButton,
    );
    return element;
  }
}

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
  };
  group.rootElement.append(group.label, group.input);
  group.input.id = id;
  group.label.htmlFor = id;
  group.label.textContent = labelText;

  return group;
}

/* ======================================================================
 * Event Handling
 * ======================================================================
 */
function handleToggleStatusButtonClick(task: Task, card: Card): void {
  task.toggleStatus();
  if (!app) {
    return;
  }
  const updatedCard: Card = new CardObject(task);
  app.replaceChild(updatedCard.rootElement, card.rootElement);
  updatedCard.toggleStatusButton.focus();
}

function handleEditTaskButtonClick(taskId: TaskId): void {
  cards.editingTaskId = taskId;
  cards.renderAll();
  document.getElementById("task-name")?.focus();
}

function handlePriorityButtonClick(priority: Priority, button: PriorityButton) {
  priority = (1 + (priority % 5)) as Priority;
  button.priority = priority;
  button.textContent = `${button.priority}`;
  button.ariaLabel = `Change priority to ${(priority % 5) + 1}`;
}

function handleSaveButtonClick(
  form: NewTaskForm | EditTaskForm,
  task?: Task,
): void {
  const name = form.taskNameInput.input.value.trim();
  if (!name) {
    return;
  }
  if (task) {
    task.name = name;
    task.priority = form.priorityButton.priority as Priority;
    cards.editingTaskId = null;
  } else {
    tasks.addTask(name, form.priorityButton.priority);
    cards.renderAll();
    document.getElementById("task-name")?.focus();
  }
  cards.renderAll();
}

function handleDeleteButtonClick(taskId: TaskId): void {
  tasks.deleteTask(taskId);
  cards.renderAll();
}
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
    this.rootElement.innerHTML = "";
    const cards = tasks.contents.map((task) =>
      task.id === this.editingTaskId
        ? new EditTaskFormObject(task)
        : new CardObject(task),
    );
    cards.forEach((card) => this.rootElement.appendChild(card.render()));
    this.rootElement.appendChild(new NewTaskFormObject().render());
  },
};

const app = document.querySelector("#app");
app?.classList.add("grid");

cards.renderAll();
