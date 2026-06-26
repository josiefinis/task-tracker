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
interface NewTaskForm {
  rootElement: HTMLElement;
  taskName: LabeledInput;
  priorityButton: PriorityButton;
  saveButton: HTMLButtonElement;
}

interface EditTaskForm extends NewTaskForm {
  dialog: HTMLDialogElement;
  deleteButton: HTMLButtonElement;
}

interface LabeledInput {
  rootElement: HTMLDivElement;
  label: HTMLLabelElement;
  input: HTMLInputElement;
}

interface PriorityButton extends HTMLButtonElement {
  priority?: Priority;
}

/* ======================================================================
 * Element Creation
 * ======================================================================
 */

function createButton(textContent: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = textContent;
  return button;
}

function createPriorityButton(priority: Priority): PriorityButton {
  const button: PriorityButton = createButton(`${priority}`);
  button.priority = priority;
  button.className = "priority icon button";
  button.ariaLabel = `Change priority to ${(priority % 5) + 1}`;
  button.addEventListener("click", () => {
    priority = (1 + (priority % 5)) as Priority;
    button.priority = priority;
    button.textContent = `${button.priority}`;
    button.ariaLabel = `Change priority to ${(priority % 5) + 1}`;
  });
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

function createNewTaskForm(): NewTaskForm {
  const form: NewTaskForm = {
    rootElement: document.createElement("div"),
    taskName: createLabeledInput("task-name", "Task name"),
    priorityButton: createPriorityButton(1),
    saveButton: createButton("Save"),
  };

  form.taskName.input.placeholder = "New task...";

  form.rootElement.className = "form card | grid container";
  form.taskName.rootElement.className = "form__input-group";
  form.taskName.input.className = "form__input task-name";
  form.taskName.label.className = "visually-hidden";
  form.saveButton.className = "form__save button";

  form.saveButton.addEventListener("click", () => {
    handleSaveTask(
      form.taskName.input.value,
      form.priorityButton.priority as Priority,
    );
  });

  setDashedBorderStyle(form);

  form.rootElement.append(
    form.taskName.rootElement,
    form.priorityButton,
    form.saveButton,
  );

  return form;
}

function createEditTaskForm(task: Task): EditTaskForm {
  const form: EditTaskForm = {
    rootElement: document.createElement("div"),
    dialog: document.createElement("dialog"),
    taskName: createLabeledInput("task-name", "Task name"),
    priorityButton: createPriorityButton(task.priority),
    saveButton: createButton("Save"),
    deleteButton: createButton("\u{1F5D1}"),
  };

  form.rootElement.className = "form card | grid container";
  form.taskName.rootElement.className = "form__input-group";
  form.taskName.input.className = "form__input task-name";
  form.taskName.label.className = "visually-hidden";
  form.saveButton.className = "form__save button";
  form.deleteButton.className = "form__delete icon button";

  form.taskName.input.value = task.name;

  form.deleteButton.ariaLabel = "Delete task";
  form.deleteButton.addEventListener("click", () => {
    tasks.deleteTask(task.id);
    cards.renderAll();
  });

  form.saveButton.ariaLabel = "Save task";
  form.saveButton.addEventListener("click", () => {
    handleSaveTask(
      form.taskName.input.value,
      form.priorityButton.priority as Priority,
      task,
    );
  });

  setDashedBorderStyle(form);

  form.rootElement.append(
    form.taskName.rootElement,
    form.priorityButton,
    form.saveButton,
    form.deleteButton,
  );

  return form;
}

interface Card {
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
    this.rootElement.append(
      this.heading,
      this.status,
      this.priority,
      this.editTaskButton,
      this.toggleStatusButton,
    );
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
    const status = document.createElement("p");
    status.className = "card__status";
    status.textContent = taskStatus;
    if (taskStatus === "completed") {
      this.heading.classList.add("line-through");
      this.rootElement.classList.add("subtle-text");
    }
    return status;
  }

  createPriorityElement(taskPriority: Priority): HTMLParagraphElement {
    const priority = document.createElement("p");
    priority.className = "priority";
    priority.textContent = `${taskPriority}`;
    priority.classList.add(`priority-${taskPriority}`);
    return priority;
  }

  createToggleStatusButton(task: Task): HTMLButtonElement {
    const toggleStatusButton = document.createElement("button");
    toggleStatusButton.className = "card__toggle-status icon button";
    toggleStatusButton.textContent = `${task.status === "completed" ? "\u21b6" : "\u2714"}`;
    toggleStatusButton.ariaLabel = `${task.status === "completed" ? "set task to pending" : "set task to completed"}`;

    toggleStatusButton.addEventListener("click", () => {
      handleToggleStatusClick(task, this);
    });
    return toggleStatusButton;
  }
  createEditTaskButton(): HTMLButtonElement {
    const editTaskButton = document.createElement("button");
    editTaskButton.className = "card__edit-task icon button";
    editTaskButton.textContent = "\u270e";
    editTaskButton.ariaLabel = "Edit task";
    editTaskButton.addEventListener("click", () => {
      cards.editingTaskId = this.taskId;
      cards.renderAll();
      document.getElementById("task-name")?.focus();
    });
    return editTaskButton;
  }
}

/* ======================================================================
 * Element Styling
 * ======================================================================
 */
function setDashedBorderStyle(form: EditTaskForm | NewTaskForm) {
  form.rootElement.dataset["type"] = "dashed-border";
  form.taskName.input.dataset["type"] = "dashed-border";
  form.priorityButton.dataset["type"] = "dashed-border";
  form.saveButton.dataset["type"] = "dashed-border";
}

/* ======================================================================
 * Event Handling
 * ======================================================================
 */
function handleToggleStatusClick(task: Task, card: Card): void {
  task.toggleStatus();
  if (!app) {
    return;
  }
  const updatedCard: Card = new CardObject(task);
  app.replaceChild(updatedCard.rootElement, card.rootElement);
  updatedCard.toggleStatusButton.focus();
}

function handleSaveTask(
  taskName: string,
  priority: Priority,
  task?: Task,
): void {
  const name = taskName.trim();
  if (!name) {
    return;
  }
  if (task) {
    task.name = name;
    task.priority = priority;
    cards.editingTaskId = null;
  } else {
    tasks.addTask(name, priority);
  }
  cards.renderAll();
  document.getElementById("task-name")?.focus();
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
    const cards = tasks.contents.map((task, index) =>
      index === this.editingTaskId
        ? createEditTaskForm(task)
        : new CardObject(task),
    );
    cards.forEach((card) => this.rootElement.appendChild(card.rootElement));
    const form = createNewTaskForm();
    this.rootElement.appendChild(form.rootElement);
  },
};

const app = document.querySelector("#app");
app?.classList.add("grid");

cards.renderAll();
