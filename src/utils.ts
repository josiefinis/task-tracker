import type { Priority } from "./types.js";

export function toPriority(value: string | number): Priority {
  if ([1, 2, 3, 4, 5].includes(+value)) {
    return value as Priority;
  } else {
    throw new Error(`Can not convert ${value} to type Priority.`);
  }
}

export function incrementPriority(priority: Priority): Priority {
  priority %= 5;
  priority++;
  return toPriority(priority);
}

export function validateTaskName(name: string): string {
  const errorMessage: string = !name
    ? "Task name is required."
    : name.length > 30
      ? "Task name should be no more than 30 characters"
      : "";
  return errorMessage;
}

export function displayLastSavedDate(): void {
  const lastSaved = localStorage.getItem("lastSaved") ?? Date();
  const element = document.getElementById("last-saved");
  if (element) {
    element.textContent = `Last saved: ${lastSaved}`;
  }
}
