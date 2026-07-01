import { incrementPriority } from "./utils.js";
export class NewTaskFormObject {
    rootElement;
    taskNameInput;
    priorityButton;
    saveButton;
    constructor() {
        this.rootElement = this.createRootElement();
        this.taskNameInput = this.createTaskNameInput();
        this.priorityButton = this.createPriorityButton();
        this.saveButton = this.createSaveButton();
    }
    createRootElement() {
        const rootElement = document.createElement("form");
        rootElement.className = "form card | grid container";
        rootElement.dataset["type"] = "dashed-border";
        return rootElement;
    }
    createTaskNameInput() {
        const input = createLabeledInput("new-task-name", "Task name");
        input.rootElement.className = "form__input-group";
        input.input.className = "form__input task-name";
        input.label.className = "visually-hidden";
        input.input.placeholder = "New task...";
        input.input.dataset["type"] = "dashed-border";
        return input;
    }
    createPriorityButton(priority = 1) {
        const button = createButton(`${priority}`);
        button.className = "priority icon button";
        button.ariaLabel = `Change priority to ${incrementPriority(priority)}`;
        button.dataset["type"] = "dashed-border";
        return button;
    }
    createSaveButton() {
        const button = createButton("Save");
        button.type = "submit";
        button.className = "form__save button";
        button.dataset["type"] = "dashed-border";
        return button;
    }
    render() {
        const rootElement = this.rootElement;
        rootElement.append(this.taskNameInput.rootElement, this.priorityButton, this.saveButton);
        return rootElement;
    }
}
export function createButton(textContent) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = textContent;
    return button;
}
export function createLabeledInput(id, labelText) {
    const group = {
        rootElement: document.createElement("div"),
        label: document.createElement("label"),
        input: document.createElement("input"),
        errorMessage: document.createElement("p"),
    };
    group.rootElement.append(group.label, group.input, group.errorMessage);
    group.input.id = id;
    group.label.htmlFor = id;
    group.label.textContent = labelText;
    group.errorMessage.classList.add("error-message");
    return group;
}
//# sourceMappingURL=new-task-form.js.map