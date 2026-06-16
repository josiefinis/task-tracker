interface Task {
  name: string;
  priority: 1 | 2 | 3 | 4 | 5;
  isCompleted: boolean;
}

const task1: Task = {name: "make dinner", priority: 5, isCompleted: false };
const task2: Task = {name: "do laundry", priority: 3, isCompleted: false };
const task3: Task = {name: "water plants", priority: 4, isCompleted: true };

const completedTasks: number = 1;
const totalTasks: number = 3;
const completionRate: number = completedTasks / totalTasks * 100;

console.log(`
Task Summary
------------------------------------------
\t\tPriority\tTask
------------------------------------------
${task1.isCompleted ? "[x]": "[ ]"}\t\t${task1.priority}\t\t\t${task1.name} 
${task2.isCompleted ? "[x]": "[ ]"}\t\t${task2.priority}\t\t\t${task2.name} 
${task3.isCompleted ? "[x]": "[ ]"}\t\t${task3.priority}\t\t\t${task3.name} 

You have completed ${completionRate.toFixed(0)}% of your tasks.
`);
