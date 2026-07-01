import type { Task, TaskId, Status, Priority, TaskList } from "./types.js";

let nextId = +(localStorage.getItem("nextId") ?? 0);

export class TaskObject implements Task {
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

export const tasks: TaskList = {
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
