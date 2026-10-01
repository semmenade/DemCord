import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    history: { type: OptionType.STRING, description: "Nickname history", default: "{}", hidden: true }
});
function getHistory() { try { return JSON.parse(settings.store.history); } catch { return {}; } }
function saveHistory(h: any) { settings.store.history = JSON.stringify(h); }
export default definePlugin({
    name: "NickHistory",
    description: "Tracks nickname changes for users in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        GUILD_MEMBER_UPDATE({ user, nick }: any) {
            if (!user?.id || !nick) return;
            const h = getHistory();
            if (!h[user.id]) h[user.id] = [];
            h[user.id].push({ nick, date: new Date().toDateString() });
            if (h[user.id].length > 20) h[user.id].shift();
            saveHistory(h);
        }
    },
    commands: [{
        name: "nickhistory",
        description: "Show nickname history for a user",
        options: [{ name: "userid", description: "User ID", type: 3, required: true }],
        execute(opts) {
            const id = opts.find((o: any) => o.name === "userid")?.value;
            const h = getHistory();
            if (!h[id]?.length) return { content: `No nickname history for user ${id}` };
            return { content: `**Nickname History for <@${id}>:**\n${h[id].reverse().map((n: any) => `${n.date}: ${n.nick}`).join("\n")}` };
        }
    }]
});
