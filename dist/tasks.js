import { loadNextId, clearStoredTasks, saveTasks } from "./local-storage.js";
let nextId = loadNextId();
export class TaskObject {
    id;
    name;
    priority;
    status = "pending";
    description;
    notes;
    constructor(name, priority) {
        this.id = nextId++;
        this.name = name;
        this.priority = priority;
    }
}
export const tasks = {
    contents: [],
    length: 0,
    addTask(name, priority = 1, description, notes) {
        const task = new TaskObject(name, priority);
        if (description) {
            task.description = description;
        }
        if (notes) {
            task.notes = notes;
        }
        this.length = this.contents.push(task);
        saveTasks(this.contents, nextId);
        return this.length;
    },
    editTask(id, name, priority, description, notes) {
        const task = this.getTaskById(id);
        task.name = name;
        if (priority) {
            task.priority = priority;
        }
        if (description) {
            task.description = description;
        }
        if (notes) {
            task.notes = notes;
        }
        saveTasks(this.contents, nextId);
    },
    deleteTask(id) {
        const index = this.contents.findIndex((task) => task.id === id);
        this.contents.splice(index, 1);
        this.length = this.contents.length;
        saveTasks(this.contents, nextId);
    },
    getTaskById(id) {
        return this.contents.find((task) => task.id === id);
    },
    toggleStatus(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.status = task.status === "pending" ? "completed" : "pending";
        }
        saveTasks(this.contents, nextId);
    },
    listAll() {
        return this.contents;
    },
    listCompleted() {
        return this.contents.filter((task) => task.status === "completed");
    },
    listPending() {
        return this.contents.filter((task) => task.status === "pending");
    },
    clear() {
        this.contents = [];
        clearStoredTasks();
    },
};
//# sourceMappingURL=tasks.js.map