import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Last seen data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "LastSeen",
    description: "Tracks when friends were last online",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        PRESENCE_UPDATES({ updates }: any) {
            const d = getData();
            for (const u of updates) {
                if (u.status === "offline") d[u.user?.id] = Date.now();
            }
            saveData(d);
        }
    },
    commands: [{
        name: "lastseen",
        description: "Check when a user was last online",
        options: [{ name: "userid", description: "User ID", type: 3, required: true }],
        execute(opts) {
            const id = opts.find((o: any) => o.name === "userid")?.value;
            const d = getData();
            if (!d[id]) return { content: `No data for user ${id}` };
            const time = new Date(d[id]).toLocaleString();
            return { content: `<@${id}> was last seen offline at: ${time}` };
        }
    }]
});
