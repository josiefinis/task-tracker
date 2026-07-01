import type { CardLayout } from "./types.js";
import { tasks } from "./tasks.js";
import { displayLastSavedDate } from "./utils.js";
import { CardObject } from "./cards.js";
import { NewTaskFormObject } from "./new-task-form.js";
import { EditTaskFormObject } from "./edit-task-form.js";

/* ======================================================================
 * Rendering
 * ======================================================================
 */
export const cards: CardLayout = {
  rootElement: document.querySelector("#app") as HTMLDivElement,
  editingTaskId: null,

  styleRootElement(): void {
    this.rootElement.classList.add("grid");
  },

  renderAll(): void {
    const focusId: string | undefined = document.activeElement?.id;
    this.rootElement.innerHTML = "";

    const cards = tasks.contents.map((task) =>
      task.id === this.editingTaskId
        ? new EditTaskFormObject(task)
        : new CardObject(task),
    );
    cards.forEach((card) => this.rootElement.appendChild(card.render()));
    this.rootElement.appendChild(new NewTaskFormObject().render());
    if (focusId) {
      document.getElementById(focusId)?.focus();
    }
    displayLastSavedDate();
  },
};

function handleClearAllButtonClick(): void {
  tasks.clear();
  cards.renderAll();
}

const clearAllButton = document.getElementById("clear-all");
clearAllButton?.addEventListener("click", handleClearAllButtonClick);
