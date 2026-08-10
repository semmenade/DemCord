import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "RPG data", default: '{"xp":0,"level":1,"messages":0}', hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return { xp: 0, level: 1, messages: 0 }; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ServerRPG",
    description: "Gain XP and levels by chatting in servers",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            const d = getData();
            d.xp += Math.floor(Math.random() * 10) + 5;
            d.messages++;
            const xpNeeded = d.level * 100;
            if (d.xp >= xpNeeded) { d.level++; d.xp = 0; showNotification({ title: "Level Up!", body: `You reached level ${d.level}!` }); }
            saveData(d);
        }
    },
    commands: [{
        name: "level",
        description: "Show your current RPG level and XP",
        execute() {
            const d = getData();
            return { content: `Level: ${d.level} | XP: ${d.xp}/${d.level * 100} | Messages: ${d.messages}` };
        }
    }]
});
