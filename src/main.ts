interface Task {
  name: string;
  priority: 1 | 2 | 3 | 4 | 5;
  isCompleted: boolean;
}

const tasks: Task[] = [];

tasks.push({ name: "make dinner", priority: 5, isCompleted: false });
tasks.push({ name: "do laundry", priority: 3, isCompleted: false });
tasks.push({ name: "water plants", priority: 4, isCompleted: true });

console.log(`
Task Summary
------------------------------------------
`);

for (let i: number = 0; i < tasks.length; i++) {
  const task: Task | undefined = tasks[i];
  if (typeof task !== "undefined") {
    console.log(
      `${i + 1}. ${task.isCompleted ? "[x]" : "[ ]"}    !${task.priority}    ${task.name}`,
    );
  }
}

const totalTasks: number = tasks.length;
console.log(`Number of tasks: ${totalTasks}`);

const completedTasks: number = tasks.filter((task) => task.isCompleted).length;
const completionRate: number = (completedTasks / totalTasks) * 100;

console.log(`You have completed ${completionRate.toFixed(0)}% of your tasks.`);
