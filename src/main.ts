import { cards } from "./render.js";
import { loadTasks } from "./local-storage.js";
import { tasks } from "./tasks.js";

tasks.contents = loadTasks();
cards.styleRootElement();
cards.renderAll();
