import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    meetings: { type: OptionType.STRING, description: "Scheduled meetings", default: "[]", hidden: true }
});
function getMeetings() { try { return JSON.parse(settings.store.meetings); } catch { return []; } }
function saveMeetings(m: any[]) { settings.store.meetings = JSON.stringify(m); }
export default definePlugin({
    name: "MeetingScheduler",
    description: "Schedule meetings with Discord users with reminders",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const meetings = getMeetings();
            const now = Date.now();
            meetings.forEach((m: any) => {
                if (Math.abs(m.time - now) < 60000 && !m.notified) {
                    import("@api/Notifications").then(({ showNotification }) => showNotification({ title: "Meeting Starting", body: `${m.title} is starting now!`, permanent: true }));
                    m.notified = true;
                }
            });
            saveMeetings(meetings);
        }, 30000);
    },
    stop() { clearInterval(this.interval); },
    commands: [
        { name: "meeting-schedule", description: "Schedule a meeting", options: [{ name: "title", description: "Meeting title", type: 3, required: true }, { name: "minutes", description: "Minutes from now", type: 10, required: true }], execute(opts: any[]) { const title = opts.find((o: any) => o.name === "title")?.value; const mins = opts.find((o: any) => o.name === "minutes")?.value; const m = getMeetings(); m.push({ title, time: Date.now() + mins * 60000, notified: false }); saveMeetings(m); return { content: `Meeting scheduled: ${title} in ${mins} minutes` }; } },
        { name: "meetings", description: "List upcoming meetings", execute() { const m = getMeetings().filter((m: any) => m.time > Date.now()); if (!m.length) return { content: "No upcoming meetings" }; return { content: `**Upcoming Meetings:**\n${m.map((m: any) => `${m.title} - in ${Math.round((m.time - Date.now()) / 60000)} min`).join("\n")}` }; } }
    ]
});
