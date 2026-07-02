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
    ? "Enter a task name."
    : name.length > 30
      ? "Enter fewer than 30 characters."
      : "";
  return errorMessage;
}
