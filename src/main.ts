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
${task1.isCompleted ? "[x]": "[ ]"}    !${task1.priority}    ${task1.name} 
${task2.isCompleted ? "[x]": "[ ]"}    !${task2.priority}    ${task2.name} 
${task3.isCompleted ? "[x]": "[ ]"}    !${task3.priority}    ${task3.name} 

You have completed ${completionRate.toFixed(0)}% of your tasks.
`);
