import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Activity data", default: "[]", hidden: true },
    maxEntries: { type: OptionType.NUMBER, description: "Max entries to track", default: 100 }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return []; } }
function saveData(d: any[]) { settings.store.data = JSON.stringify(d.slice(-settings.store.maxEntries)); }
export default definePlugin({
    name: "FriendActivityTimeline",
    description: "See what your friends have been doing in a unified activity timeline",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        PRESENCE_UPDATES({ updates }: any) {
            const d = getData();
            for (const u of updates) {
                if (u.activities?.length) d.push({ userId: u.user?.id, activity: u.activities[0]?.name, status: u.status, time: Date.now() });
            }
            saveData(d);
        }
    },
    commands: [{
        name: "friend-timeline",
        description: "Show recent friend activity",
        execute() {
            const d = getData().slice(-15).reverse();
            if (!d.length) return { content: "No friend activity tracked yet" };
            return { content: `**Friend Activity Timeline:**\n${d.map((e: any) => `<@${e.userId}>: ${e.activity || e.status} - ${new Date(e.time).toLocaleTimeString()}`).join("\n")}` };
        }
    }]
});
