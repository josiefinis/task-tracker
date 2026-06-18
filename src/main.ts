type priority = 1 | 2 | 3 | 4 | 5;
interface Task {
  name: string;
  priority: priority;
  isCompleted: boolean;
}

function printHeader(): void {
  console.log(`
 ==================================
 
 Task Tracker
 
 ==================================
`);
}

const printTasksLength = (tasks: Task[]): void =>
  console.log(`Number of tasks: ${tasks.length}`);

function printTasks(tasks: Task[]): void {
  for (let i: number = 0; i < tasks.length; i++) {
    const task: Task | undefined = tasks[i];
    if (typeof task !== "undefined") {
      console.log(
        `${i + 1}. ${task.isCompleted ? "[x]" : "[ ]"}    !${task.priority}    ${task.name}`,
      );
    }
  }
}

const addTask = (tasks: Task[], name: string, priority: priority): void => {
  tasks.push({ name: name, priority: priority, isCompleted: false });
};

const completeTask = (tasks: Task[], name: string): boolean => {
  const task: Task | undefined = tasks.find((task) => task.name === name);
  if (typeof task === "undefined") {
    return false;
  }
  task.isCompleted = true;
  return true;
};

const tasks: Task[] = [];

addTask(tasks, "make dinner", 5);
addTask(tasks, "do laundry", 3);
addTask(tasks, "water plants", 4);
completeTask(tasks, "water plants");

/*
tasks.push({ name: "make dinner", priority: 5, isCompleted: false });
tasks.push({ name: "do laundry", priority: 3, isCompleted: false });
tasks.push({ name: "water plants", priority: 4, isCompleted: true });
*/

printHeader();
printTasks(tasks);
printTasksLength(tasks);
addTask(tasks, "buy chives", 5);
printTasks(tasks);
printTasksLength(tasks);

const completedTasks: number = tasks.filter((task) => task.isCompleted).length;
const completionRate: number = (completedTasks / tasks.length) * 100;

console.log(`You have completed ${completionRate.toFixed(0)}% of your tasks.`);
