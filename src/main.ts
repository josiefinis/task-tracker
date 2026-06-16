interface Task {
    taskName: string;
    priority: 1 | 2 | 3 | 4 | 5;
    isCompleted: boolean;
}

const task1: Task = {taskName: "make dinner", priority: 5, isCompleted: false };
const task2: Task = {taskName: "do laundry", priority: 3, isCompleted: false };
const task3: Task = {taskName: "water plants", priority: 4, isCompleted: true };

const completedTasks: number = 1;
const totalTasks: number = 3;
const completionRate: number = completedTasks / totalTasks * 100;

console.log(`
Task Summary
------------------------------------------
\t\tPriority\tTask
------------------------------------------
${task1.isCompleted ? "[x]": "[ ]"}\t\t${task1.priority}\t\t\t${task1.taskName} 
${task2.isCompleted ? "[x]": "[ ]"}\t\t${task2.priority}\t\t\t${task2.taskName} 
${task3.isCompleted ? "[x]": "[ ]"}\t\t${task3.priority}\t\t\t${task3.taskName} 

You have completed ${completionRate.toFixed(0)}% of your tasks.
`);
