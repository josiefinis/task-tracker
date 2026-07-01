import { app } from "./render.js";
import { loadTasks } from "./local-storage.js";
import { tasks } from "./tasks.js";

tasks.contents = loadTasks();
app.styleRootElement();
app.renderAll();
