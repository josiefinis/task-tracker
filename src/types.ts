export type TaskId = number;
export type Priority = 1 | 2 | 3 | 4 | 5;
export type Status = "pending" | "completed";

export interface Task {
  id: TaskId;
  name: string;
  priority: Priority;
  status: Status;
  description?: string;
  notes?: string;
}

export interface TaskList {
  contents: Task[];
  length: number;

  addTask(
    name: string,
    priority?: Priority,
    description?: string,
    notes?: string,
  ): number;
  editTask(
    id: TaskId,
    name: string,
    priority?: Priority,
    description?: string,
    notes?: string,
  ): void;
  deleteTask(id: TaskId): void;
  getTaskById(id: TaskId): Task | undefined;
  toggleStatus(id: TaskId): void;
  listAll(): Task[];
  listCompleted(): Task[];
  listPending(): Task[];
  clear(): void;
}

export interface Card {
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

export interface NewTaskForm {
  rootElement: HTMLFormElement;
  taskNameInput: LabeledInput;
  priorityButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;

  createRootElement(): HTMLFormElement;
  createTaskNameInput(): LabeledInput;
  createPriorityButton(priority?: Priority): HTMLButtonElement;
  createSaveButton(): HTMLButtonElement;
  render(): HTMLElement;
}

export interface EditTaskForm extends NewTaskForm {
  task: Task;
  dialog: HTMLDialogElement;
  deleteButton: HTMLButtonElement;

  createDialogElement(): HTMLDialogElement;
  createDeleteButton(): HTMLButtonElement;
}

export interface LabeledInput {
  rootElement: HTMLDivElement;
  label: HTMLLabelElement;
  input: HTMLInputElement;
  errorMessage: HTMLParagraphElement;
}

export interface AppLayout {
  rootElement: HTMLDivElement;
  editingTaskId: TaskId | null;

  styleRootElement(): void;
  renderCard(task: Task): void;
  renderNewTaskForm(): void;
  renderEditTaskForm(task: Task): void;
  renderTasks(tasks: TaskList): void;
  renderLastSavedDate(): void;
  renderAll(): void;
}
