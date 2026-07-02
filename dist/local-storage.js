export function saveTasks(tasks, nextId) {
  const tasksJson = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksJson);
  localStorage.setItem("nextId", nextId.toString());
  localStorage.setItem("lastSaved", Date());
}
export function loadTasks() {
  const tasksJson = localStorage.getItem("tasks");
  if (tasksJson === null) {
    return [];
  }
  return JSON.parse(tasksJson);
}
export function loadNextId() {
  return +(localStorage.getItem("nextId") ?? 0);
}
export function clearStoredTasks() {
  localStorage.removeItem("tasks");
  localStorage.removeItem("nextId");
  localStorage.setItem("lastSaved", Date());
}
//# sourceMappingURL=local-storage.js.map
