import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    schedules: { type: OptionType.STRING, description: "Scheduled recurring messages", default: "[]", hidden: true }
});
function getSchedules() { try { return JSON.parse(settings.store.schedules); } catch { return []; } }
function saveSchedules(s: any[]) { settings.store.schedules = JSON.stringify(s); }
export default definePlugin({
    name: "MessageSchedulerRepeat",
    description: "Schedule recurring messages like a bot with custom intervals",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const schedules = getSchedules();
            const now = Date.now();
            schedules.forEach((s: any) => {
                if (now >= s.nextRun) {
                    console.log(`[MessageSchedulerRepeat] Would send: ${s.message} to ${s.channelId}`);
                    s.nextRun = now + s.intervalMs;
                    showNotification({ title: "Scheduled Message", body: `Sent recurring message: ${s.message?.slice(0, 50)}` });
                }
            });
            saveSchedules(schedules);
        }, 30000);
    },
    stop() { clearInterval(this.interval); },
    commands: [
        { name: "schedule-repeat", description: "Schedule a recurring message", options: [{ name: "message", description: "Message to send", type: 3, required: true }, { name: "hours", description: "Repeat every X hours", type: 10, required: true }], execute(opts: any[], ctx: any) { const msg = opts.find((o: any) => o.name === "message")?.value; const hrs = opts.find((o: any) => o.name === "hours")?.value; const s = getSchedules(); s.push({ message: msg, channelId: ctx.channel.id, intervalMs: hrs * 3600000, nextRun: Date.now() + hrs * 3600000 }); saveSchedules(s); return { content: `Recurring message scheduled every ${hrs}h: ${msg}` }; } },
        { name: "schedule-list", description: "List recurring schedules", execute() { const s = getSchedules(); if (!s.length) return { content: "No recurring schedules" }; return { content: `**Recurring Schedules:**\n${s.map((sc: any, i: number) => `${i+1}. Every ${Math.round(sc.intervalMs/3600000)}h: ${sc.message?.slice(0,50)}`).join("\n")}` }; } }
    ]
});
