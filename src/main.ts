import { tasks } from "./tasks.js";
import { cards } from "./render.js";
/* ======================================================================
 * Render Tasks as Cards
 * ======================================================================
 */

tasks.load();
cards.styleRootElement();
cards.renderAll();
