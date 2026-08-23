import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    log: { type: OptionType.STRING, description: "Spam log", default: "[]", hidden: true },
    threshold: { type: OptionType.NUMBER, description: "Messages per 10s to flag as spam", default: 5 }
});
function getLog() { try { return JSON.parse(settings.store.log); } catch { return []; } }
function saveLog(l: any[]) { settings.store.log = JSON.stringify(l.slice(-100)); }
export default definePlugin({
    name: "SpamLogger",
    description: "Logs potential spam activity for review",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    counts: new Map<string, number>(),
    flux: {
        MESSAGE_CREATE({ message }: any) {
            const id = message.author?.id;
            if (!id) return;
            const count = ((this as any).counts.get(id) || 0) + 1;
            (this as any).counts.set(id, count);
            setTimeout(() => (this as any).counts.set(id, Math.max(0, ((this as any).counts.get(id) || 1) - 1)), 10000);
            if (count >= settings.store.threshold) {
                const log = getLog();
                log.push({ user: message.author?.username, id, time: new Date().toLocaleString(), count });
                saveLog(log);
                (this as any).counts.set(id, 0);
            }
        }
    },
    commands: [{
        name: "spamlog",
        description: "View the spam log",
        execute() {
            const log = getLog().slice(-10).reverse();
            if (!log.length) return { content: "No spam logged yet" };
            return { content: `**Spam Log:**\n${log.map((e: any) => `${e.time}: ${e.user} (${e.count} msgs)`).join("\n")}` };
        }
    }]
});
