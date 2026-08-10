import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    todos: { type: OptionType.STRING, description: "Saved todos", default: "[]", hidden: true }
});

function getTodos() { try { return JSON.parse(settings.store.todos); } catch { return []; } }
function saveTodos(t: any[]) { settings.store.todos = JSON.stringify(t); }

export default definePlugin({
    name: "TodoList",
    description: "Built-in todo list inside Discord accessible from any server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "todo-add",
            description: "Add a todo item",
            options: [{ name: "task", description: "Task to add", type: 3, required: true }],
            execute(opts) {
                const task = opts.find((o: any) => o.name === "task")?.value;
                const todos = getTodos();
                todos.push({ task, done: false, id: Date.now() });
                saveTodos(todos);
                return { content: `Added: ${task}` };
            }
        },
        {
            name: "todo-list",
            description: "Show all todos",
            execute() {
                const todos = getTodos();
                if (!todos.length) return { content: "No todos yet. Use /todo-add to get started." };
                return { content: todos.map((t: any, i: number) => `${i + 1}. [${t.done ? "X" : " "}] ${t.task}`).join("\n") };
            }
        },
        {
            name: "todo-done",
            description: "Mark a todo as done",
            options: [{ name: "number", description: "Todo number", type: 10, required: true }],
            execute(opts) {
                const idx = opts.find((o: any) => o.name === "number")?.value - 1;
                const todos = getTodos();
                if (!todos[idx]) return { content: "Todo not found" };
                todos[idx].done = true;
                saveTodos(todos);
                return { content: `Marked as done: ${todos[idx].task}` };
            }
        },
        {
            name: "todo-clear",
            description: "Clear all completed todos",
            execute() {
                const todos = getTodos().filter((t: any) => !t.done);
                saveTodos(todos);
                return { content: "Cleared completed todos" };
            }
        }
    ]
});
