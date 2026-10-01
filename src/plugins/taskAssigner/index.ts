import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    tasks: { type: OptionType.STRING, description: "Tasks data", default: "[]", hidden: true }
});
function getTasks() { try { return JSON.parse(settings.store.tasks); } catch { return []; } }
function saveTasks(t: any[]) { settings.store.tasks = JSON.stringify(t); }
export default definePlugin({
    name: "TaskAssigner",
    description: "Assign tasks to server members with deadlines and track completion",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "task-assign",
            description: "Assign a task to a user",
            options: [
                { name: "userid", description: "User ID", type: 3, required: true },
                { name: "task", description: "Task description", type: 3, required: true },
                { name: "deadline", description: "Deadline e.g. 2024-12-31", type: 3, required: false }
            ],
            execute(opts, ctx) {
                const userId = opts.find((o: any) => o.name === "userid")?.value;
                const task = opts.find((o: any) => o.name === "task")?.value;
                const deadline = opts.find((o: any) => o.name === "deadline")?.value;
                const tasks = getTasks();
                tasks.push({ id: Date.now(), userId, task, deadline, done: false, guildId: ctx.guild?.id });
                saveTasks(tasks);
                return { content: `Task assigned to <@${userId}>: ${task}${deadline ? ` (due: ${deadline})` : ""}` };
            }
        },
        {
            name: "tasks",
            description: "Show all active tasks",
            execute() {
                const tasks = getTasks().filter((t: any) => !t.done);
                if (!tasks.length) return { content: "No active tasks" };
                return { content: `**Active Tasks:**\n${tasks.map((t: any) => `[${t.id}] <@${t.userId}>: ${t.task}${t.deadline ? ` (due: ${t.deadline})` : ""}`).join("\n")}` };
            }
        },
        {
            name: "task-done",
            description: "Mark a task as complete",
            options: [{ name: "id", description: "Task ID", type: 10, required: true }],
            execute(opts) {
                const id = opts.find((o: any) => o.name === "id")?.value;
                const tasks = getTasks();
                const task = tasks.find((t: any) => t.id === id);
                if (!task) return { content: `Task not found: ${id}` };
                task.done = true;
                saveTasks(tasks);
                return { content: `Task completed: ${task.task}` };
            }
        }
    ]
});
