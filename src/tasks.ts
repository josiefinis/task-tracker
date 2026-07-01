import { loadNextId, clearStoredTasks, saveTasks } from "./local-storage.js";
import type { Task, TaskId, Status, Priority, TaskList } from "./types.js";

let nextId = loadNextId();

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
    saveTasks(this.contents, nextId);
    return this.length;
  },

  editTask(
    id: TaskId,
    name: string,
    priority: Priority,
    description?: string,
    notes?: string,
  ): void {
    const task: Task = this.getTaskById(id) as Task;
    task.name = name;
    if (priority) {
      task.priority = priority;
    }
    if (description) {
      task.description = description;
    }
    if (notes) {
      task.notes = notes;
    }
    saveTasks(this.contents, nextId);
  },

  deleteTask(id: TaskId): void {
    const index = this.contents.findIndex((task) => task.id === id);
    this.contents.splice(index, 1);
    this.length = this.contents.length;
    saveTasks(this.contents, nextId);
  },

  getTaskById(id: TaskId): Task | undefined {
    return this.contents.find((task) => task.id === id);
  },

  toggleStatus(id: TaskId): void {
    const task: Task | undefined = this.getTaskById(id);
    if (task) {
      task.status = task.status === "pending" ? "completed" : "pending";
    }
    saveTasks(this.contents, nextId);
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

  clear(): void {
    this.contents = [];
    clearStoredTasks();
  },
};
