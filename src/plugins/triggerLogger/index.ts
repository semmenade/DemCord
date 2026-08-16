import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    triggers: { type: OptionType.STRING, description: "Keywords to log comma separated", default: "" },
    log: { type: OptionType.STRING, description: "Trigger log", default: "[]", hidden: true }
});
function getLog() { try { return JSON.parse(settings.store.log); } catch { return []; } }
function saveLog(l: any[]) { settings.store.log = JSON.stringify(l); }
export default definePlugin({
    name: "TriggerLogger",
    description: "Logs messages containing specific keywords for later review",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.triggers) return;
            const triggers = settings.store.triggers.split(",").map((t: string) => t.trim().toLowerCase());
            const content = message.content?.toLowerCase() || "";
            const found = triggers.find((t: string) => content.includes(t));
            if (!found) return;
            const log = getLog();
            log.push({ trigger: found, author: message.author?.username, content: message.content, time: new Date().toLocaleString() });
            saveLog(log);
        }
    },
    commands: [{
        name: "triggerlog",
        description: "View the trigger log",
        execute() {
            const log = getLog().slice(-10).reverse();
            if (!log.length) return { content: "No triggers logged yet" };
            return { content: `**Trigger Log:**\n${log.map((e: any) => `[${e.time}] ${e.author} (${e.trigger}): ${e.content?.slice(0, 100)}`).join("\n")}` };
        }
    }]
});
