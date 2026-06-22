type priority = 1 | 2 | 3 | 4 | 5;
interface Task {
  name: string;
  priority: priority;
  isCompleted: boolean;
  notes?: string;
}

interface TaskList {
  contents: Task[];
  length: number;
  addTask(name: string, priority?: priority, notes?: string): number;
  completeTask(name: string): boolean;
  listAll(): Task[];
  listCompleted(): Task[];
  listPending(): Task[];
}

const tasks: TaskList = {
  contents: [],
  length: 0,

  addTask(name: string, priority: priority = 1, notes?: string): number {
    const task: Task = { name: name, priority: priority, isCompleted: false };
    if (notes) {
      task.notes = notes;
    }
    this.length = this.contents.push(task);
    return this.length;
  },

  completeTask(name: string): boolean {
    const task: Task | undefined = this.contents.find(
      (task) => task.name === name,
    );
    return task ? (task.isCompleted = true) : false;
  },

  listAll(): Task[] {
    return this.contents;
  },

  listCompleted(): Task[] {
    return this.contents.filter((task) => task.isCompleted);
  },

  listPending(): Task[] {
    return this.contents.filter((task) => !task.isCompleted);
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
        `${index + 1}. ${task.isCompleted ? "[x]" : "[ ]"}    !${task.priority}    ${task.name}`,
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
tasks.addTask("do laundry", 3);
tasks.addTask("buy paint");
tasks.addTask("water plants", 4);
tasks.completeTask("water plants");

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
