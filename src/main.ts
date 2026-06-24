type Priority = 1 | 2 | 3 | 4 | 5;
type Status = "pending" | "completed";

interface Task {
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
  toggleStatus(taskName: string): Status | undefined;
  listAll(): Task[];
  listCompleted(): Task[];
  listPending(): Task[];
}

class TaskObject implements Task {
  name: string;
  priority: Priority;
  status: Status = "pending";

  constructor(name: string, priority: Priority) {
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

  toggleStatus(taskName: string): Status | undefined {
    const task: Task | undefined = this.contents.find(
      (task) => task.name === taskName,
    );
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

tasks.addTask("make dinner", 5);
tasks.addTask("do laundry", 3, "", "lights");
tasks.addTask("buy paint");
tasks.addTask("water plants", 4);
tasks.toggleStatus("water plants");
tasks.addTask("buy chives", 5);

/* Render */
const app = document.querySelector("#app");
app?.classList.add("grid");

function appendElement(
  parent: Element,
  tagName: string,
  textContent: string,
  className?: string,
) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  if (className) {
    element.className = className;
  }
  parent.appendChild(element);
}

function createCard(task: Task): HTMLElement {
  const card = document.createElement("article");
  card.classList.add("card");
  card.classList.add("grid");
  card.classList.add("container");
  appendElement(card, "h2", task.name, "card__heading");
  appendElement(card, "p", `${task.priority}`, "card__priority");
  appendElement(card, "p", task.status, "card__status");
  return card;
}

function renderCards(): void {
  if (!app) {
    return;
  }
  app.innerHTML = "";

  const cards = tasks.contents.map((task) => createCard(task));
  cards.forEach((card) => app.appendChild(card));
}

renderCards();
