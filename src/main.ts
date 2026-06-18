type priority = 1 | 2 | 3 | 4 | 5;
interface Task {
  name: string;
  priority: priority;
  isCompleted: boolean;
}

const printHeader = (): void => {
  console.log(`
 ==================================
 
 Task Tracker
 
 ==================================
`);
};

const printTasksLength = (tasks: Task[]): void =>
  console.log(`Number of tasks: ${tasks.length}`);

function printTasks(tasks: Task[]): void {
  let printout = "";
  for (let i: number = 0; i < tasks.length; i++) {
    const task: Task | undefined = tasks[i];
    printout = printout.concat(
      task
        ? `${i + 1}. ${task.isCompleted ? "[x]" : "[ ]"}    !${task.priority}    ${task.name}\n`
        : "",
    );
  }
  console.log(printout);
}

const addTask = (tasks: Task[], name: string, priority: priority): number =>
  tasks.push({ name: name, priority: priority, isCompleted: false });

const completeTask = (tasks: Task[], name: string): boolean => {
  const task: Task | undefined = tasks.find((task) => task.name === name);
  return task ? (task.isCompleted = true) : false;
};

const tasks: Task[] = [];

addTask(tasks, "make dinner", 5);
addTask(tasks, "do laundry", 3);
addTask(tasks, "water plants", 4);
completeTask(tasks, "water plants");

printHeader();
printTasks(tasks);
printTasksLength(tasks);
addTask(tasks, "buy chives", 5);
printTasks(tasks);
printTasksLength(tasks);

const completedTasks: number = tasks.filter((task) => task.isCompleted).length;
const completionRate: number = (completedTasks / tasks.length) * 100;

console.log(`You have completed ${completionRate.toFixed(0)}% of your tasks.`);
