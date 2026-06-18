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

const printTotal = (tasks: Task[]): void =>
  console.log(`Number of tasks: ${tasks.length}`);

const printTaskList = (tasks: Task[]): void => {
  const printout: string = tasks
    .map(
      (task, index) =>
        `${index + 1}. ${task.isCompleted ? "[x]" : "[ ]"}    !${task.priority}    ${task.name}`,
    )
    .join("\n");
  console.log(printout);
};

const addTask = (tasks: Task[], name: string, priority: priority): number =>
  tasks.push({ name: name, priority: priority, isCompleted: false });

const setCompleted = (tasks: Task[], name: string): boolean => {
  const task: Task | undefined = tasks.find((task) => task.name === name);
  return task ? (task.isCompleted = true) : false;
};

const tasks: Task[] = [];

addTask(tasks, "make dinner", 5);
addTask(tasks, "do laundry", 3);
addTask(tasks, "water plants", 4);
setCompleted(tasks, "water plants");

printHeader();
printTaskList(tasks);
printTotal(tasks);
addTask(tasks, "buy chives", 5);
printTaskList(tasks);
printTotal(tasks);

const totalCompleted: number = tasks.filter((task) => task.isCompleted).length;
const completionRate: number = (totalCompleted / tasks.length) * 100;

console.log(`You have completed ${completionRate.toFixed(0)}% of your tasks.`);
