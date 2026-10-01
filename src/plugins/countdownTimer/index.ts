import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const timers: any[] = [];
export default definePlugin({
    name: "CountdownTimer",
    description: "Set countdown timers that alert you when done",
    authors: [{ name: "DemCord", id: 0n }],
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            timers.filter(t => Date.now() >= t.end).forEach(t => {
                showNotification({ title: "Timer Done", body: t.label, permanent: true });
                timers.splice(timers.indexOf(t), 1);
            });
        }, 5000);
    },
    stop() { clearInterval(this.interval); },
    commands: [{
        name: "timer",
        description: "Set a countdown timer",
        options: [
            { name: "minutes", description: "Minutes", type: 10, required: true },
            { name: "label", description: "Timer label", type: 3, required: false }
        ],
        execute(opts) {
            const minutes = opts.find((o: any) => o.name === "minutes")?.value;
            const label = opts.find((o: any) => o.name === "label")?.value || `${minutes} minute timer`;
            timers.push({ end: Date.now() + minutes * 60000, label });
            return { content: `Timer set: ${label} (${minutes} min)` };
        }
    }]
});
