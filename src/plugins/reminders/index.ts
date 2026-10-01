import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

const reminders: any[] = [];

export default definePlugin({
    name: "Reminders",
    description: "Set reminders that ping you in Discord at a specific time",
    authors: [{ name: "DemCord", id: 0n }],

    interval: null as any,

    start() {
        this.interval = setInterval(() => {
            const now = Date.now();
            reminders.filter(r => r.time <= now).forEach(r => {
                showNotification({ title: "Reminder", body: r.message, permanent: true });
                reminders.splice(reminders.indexOf(r), 1);
            });
        }, 10000);
    },

    stop() { clearInterval(this.interval); },

    commands: [
        {
            name: "remind",
            description: "Set a reminder",
            options: [
                { name: "message", description: "What to remind you about", type: 3, required: true },
                { name: "minutes", description: "Minutes from now", type: 10, required: true }
            ],
            execute(opts) {
                const message = opts.find((o: any) => o.name === "message")?.value;
                const minutes = opts.find((o: any) => o.name === "minutes")?.value;
                reminders.push({ message, time: Date.now() + minutes * 60000 });
                return { content: `Reminder set for ${minutes} minute(s): ${message}` };
            }
        },
        {
            name: "reminders",
            description: "List all active reminders",
            execute() {
                if (!reminders.length) return { content: "No active reminders" };
                return { content: reminders.map((r, i) => `${i + 1}. ${r.message} - in ${Math.round((r.time - Date.now()) / 60000)} min`).join("\n") };
            }
        }
    ]
});
