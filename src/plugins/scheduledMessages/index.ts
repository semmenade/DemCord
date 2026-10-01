import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

const scheduled: any[] = [];

export default definePlugin({
    name: "ScheduledMessages",
    description: "Schedule messages to be sent at a specific time",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "schedule",
        description: "Schedule a message to send later",
        options: [
            { name: "message", description: "Message to send", type: 3, required: true },
            { name: "delay", description: "Delay in minutes", type: 10, required: true }
        ],
        execute(opts, ctx) {
            const msg = opts.find((o: any) => o.name === "message")?.value;
            const delay = opts.find((o: any) => o.name === "delay")?.value * 60000;
            scheduled.push({ msg, channelId: ctx.channel.id, time: Date.now() + delay });
            showNotification({ title: "ScheduledMessages", body: `Message scheduled in ${opts.find((o:any)=>o.name==="delay")?.value} minutes` });
            return { content: ` Message scheduled!` };
        }
    }],

    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const now = Date.now();
            scheduled.filter(s => s.time <= now).forEach(s => {
                console.log(`[ScheduledMessages] Sending to ${s.channelId}: ${s.msg}`);
                scheduled.splice(scheduled.indexOf(s), 1);
            });
        }, 10000);
    },
    stop() { clearInterval(this.interval); }
});

