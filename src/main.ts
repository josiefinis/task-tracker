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

tasks.addTask("meet with CTO", 5);
tasks.addTask("client lunch", 3, "", "lights");
tasks.addTask("phone purchasing");
tasks.addTask("give keynote", 4);
tasks.addTask("onboard new hire", 4);
tasks.addTask("book flights", 2);
tasks.toggleStatus("book flights");

/* Render */
interface Card {
  renderable: HTMLElement;
  heading: HTMLElement;
  status: HTMLElement;
  priority: HTMLElement;
}

function createCard(task: Task): Card {
  let card: Card = {
    renderable: document.createElement("article"),
    heading: document.createElement("h2"),
    priority: document.createElement("p"),
    status: document.createElement("p"),
  };

  card.renderable.className = "card | grid container";
  card.heading.className = "card__heading";
  card.priority.className = "card__priority";
  card.status.className = "card__status";

  card.heading.textContent = task.name;
  card.priority.textContent = `${task.priority}`;
  card.status.textContent = task.status;

  card = applyConditionalStyles(card, task);
  card.renderable.append(card.heading, card.priority, card.status);
  return card;
}

function applyConditionalStyles(card: Card, task: Task): Card {
  if (task.status === "completed") {
    card.heading.classList.add("line-through");
    card.renderable.classList.add("subtle-text");
  }
  card.priority.classList.add(`priority-${task.priority}`);

  return card;
}

function renderCards(): void {
  if (!app) {
    return;
  }
  app.innerHTML = "";

  const cards = tasks.contents.map((task) => createCard(task));
  cards.forEach((card) => app.appendChild(card.renderable));
}

const app = document.querySelector("#app");
app?.classList.add("grid");

renderCards();
