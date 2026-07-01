import { NewTaskFormObject, createButton } from "./new-task-form.js";
export class EditTaskFormObject extends NewTaskFormObject {
    task;
    dialog;
    deleteButton;
    constructor(task) {
        super();
        this.task = task;
        this.dialog = this.createDialogElement();
        this.priorityButton = this.createPriorityButton(task.priority);
        this.deleteButton = this.createDeleteButton();
        this.taskNameInput.input.id = "edit-task-name";
        this.taskNameInput.input.value = task.name;
        this.rootElement.appendChild(this.deleteButton);
    }
    createDialogElement() {
        const dialog = document.createElement("dialog");
        return dialog;
    }
    createDeleteButton() {
        const button = createButton("\u{1F5D1}");
        button.className = "form__delete icon button";
        button.ariaLabel = "Delete task";
        return button;
    }
    render() {
        const rootElement = this.rootElement;
        rootElement.append(this.taskNameInput.rootElement, this.priorityButton, this.saveButton, this.deleteButton);
        return rootElement;
    }
}
//# sourceMappingURL=edit-task-form.js.map