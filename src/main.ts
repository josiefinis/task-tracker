type priority = 1 | 2 | 3 | 4 | 5;
interface Task {
  name: string;
  priority: priority;
  isCompleted: boolean;
}

const showHeader = (): void => {
  console.log(`
 ==================================
 
 Task Tracker
 
 ==================================
`);
};

const showTotal = (tasks: Task[]): void =>
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

const listCompleted = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => task.isCompleted);
};

const listPending = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => !task.isCompleted);
};

const showCompletedTasks = (tasks: Task[]): void => {
  showTasks(listCompleted(tasks));
};

const showPendingTasks = (tasks: Task[]): void => {
  showTasks(listPending(tasks));
};

const addTask = (tasks: Task[], name: string, priority: priority = 1): number =>
  tasks.push({ name: name, priority: priority, isCompleted: false });

const completeTask = (tasks: Task[], name: string): boolean => {
  const task: Task | undefined = tasks.find((task) => task.name === name);
  return task ? (task.isCompleted = true) : false;
};

const showStatistics = (tasks: Task[]): void => {
  const totalCompleted: number = listCompleted(tasks).length;
  const totalPending: number = listPending(tasks).length;
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

const tasks: Task[] = [];

addTask(tasks, "make dinner", 5);
addTask(tasks, "do laundry", 3);
addTask(tasks, "water plants", 4);
completeTask(tasks, "water plants");

showHeader();
showTasks(tasks);
showTotal(tasks);
addTask(tasks, "buy chives", 5);
showTasks(tasks);
showTotal(tasks);

console.log(`
Completed Tasks`);
showCompletedTasks(tasks);
console.log(`
Pending Tasks`);
showPendingTasks(tasks);
showStatistics(tasks);
