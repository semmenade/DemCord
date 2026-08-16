import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    log: { type: OptionType.STRING, description: "Login attempt log", default: "[]", hidden: true }
});
function getLog() { try { return JSON.parse(settings.store.log); } catch { return []; } }
function saveLog(l: any[]) { settings.store.log = JSON.stringify(l); }
export default definePlugin({
    name: "LoginAttemptLog",
    description: "Logs every Discord login event with timestamp",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    start() {
        const log = getLog();
        log.push({ time: new Date().toLocaleString(), type: "session_start", ua: navigator.userAgent.slice(0, 50) });
        if (log.length > 50) log.shift();
        saveLog(log);
        showNotification({ title: "LoginAttemptLog", body: `Session started at ${new Date().toLocaleTimeString()}` });
    },
    commands: [{
        name: "loginlog",
        description: "Show recent login log",
        execute() {
            const log = getLog().slice(-10).reverse();
            if (!log.length) return { content: "No login log entries yet" };
            return { content: `**Login Log:**\n${log.map((e: any) => `${e.time}: ${e.type}`).join("\n")}` };
        }
    }]
});
