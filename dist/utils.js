export function toPriority(value) {
    if ([1, 2, 3, 4, 5].includes(+value)) {
        return value;
    }
    else {
        throw new Error(`Can not convert ${value} to type Priority.`);
    }
}
export function incrementPriority(priority) {
    priority %= 5;
    priority++;
    return toPriority(priority);
}
export function validateTaskName(name) {
    const errorMessage = !name
        ? "Task name is required."
        : name.length > 30
            ? "Task name should be no more than 30 characters"
            : "";
    return errorMessage;
}
//# sourceMappingURL=utils.js.map