import type { Task, TaskId } from "./types.js";

export function saveTasks(tasks: Task[], nextId: TaskId): void {
  const tasksJson = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksJson);
  localStorage.setItem("nextId", nextId.toString());
  localStorage.setItem("lastSaved", Date());
}

export function loadTasks(): Task[] {
  const tasksJson: string | null = localStorage.getItem("tasks");
  if (tasksJson === null) {
    return [];
  }
  return JSON.parse(tasksJson) as Task[];
}

export function loadNextId(): TaskId {
  return +(localStorage.getItem("nextId") ?? 0);
}

export function clearStoredTasks(): void {
  localStorage.removeItem("tasks");
  localStorage.removeItem("nextId");
  localStorage.setItem("lastSaved", Date());
}
