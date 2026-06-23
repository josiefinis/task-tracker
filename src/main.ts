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

class Task implements Task {
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
    const task: Task = new Task(name, priority);
    if (notes) {
      task.notes = notes;
    }
    if (description) {
      task.description = description;
    }
    this.length = this.contents.push(task);
    return this.length;
  },

  toggleStatus(taskName: string): Status | undefined {
    const task: Task | undefined = this.contents.find(
      (task) => task.name === taskName,
    );
    return !task ? undefined : task.toggleStatus();
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

const showHeader = (): void => {
  console.log(`
 ==================================
 
 Task Tracker
 
 ==================================
`);
};

const showTotal = (tasks: TaskList): void =>
  console.log(`Number of tasks: ${tasks.length}`);

const showTasks = (tasks: Task[]): void => {
  const out: string = tasks
    .map(
      (task, index) =>
        `${index + 1}. ${task.status === "completed" ? "[x]" : "[ ]"}    !${task.priority}    ${task.name}    ${task.notes ? `(${task.notes})` : ""}`,
    )
    .join("\n");
  console.log(out);
};

const showCompletedTasks = (tasks: TaskList): void => {
  showTasks(tasks.listCompleted());
};

const showPendingTasks = (tasks: TaskList): void => {
  showTasks(tasks.listPending());
};

const showStatistics = (tasks: TaskList): void => {
  const totalCompleted: number = tasks.listCompleted().length;
  const totalPending: number = tasks.listPending().length;
  const totalTasks: number = tasks.length;
  const completionRate: number = (totalCompleted / totalTasks) * 100;

  console.log(
    `
Statistics
==========
  ${totalTasks} tasks
  ${totalPending} pending
  ${totalCompleted} completed
You have completed ${completionRate.toFixed(0)}% of your tasks.
`,
  );
};

tasks.addTask("make dinner", 5);
tasks.addTask("do laundry", 3, "", "lights");
tasks.addTask("buy paint");
tasks.addTask("water plants", 4);
tasks.toggleStatus("water plants");

showHeader();
showTasks(tasks.listAll());
showTotal(tasks);
tasks.addTask("buy chives", 5);
showTasks(tasks.listAll());
showTotal(tasks);

console.log(`
Completed Tasks`);
showCompletedTasks(tasks);
console.log(`
Pending Tasks`);
showPendingTasks(tasks);
showStatistics(tasks);
