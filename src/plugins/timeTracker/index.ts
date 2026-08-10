import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    sessions: { type: OptionType.STRING, description: "Time tracking sessions", default: "[]", hidden: true }
});
function getSessions() { try { return JSON.parse(settings.store.sessions); } catch { return []; } }
function saveSessions(s: any[]) { settings.store.sessions = JSON.stringify(s); }
export default definePlugin({
    name: "TimeTracker",
    description: "Log hours spent in voice channels for billing or productivity",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    activeSession: null as any,
    flux: {
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            const self = voiceStates.find((s: any) => s.userId === (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id);
            if (!self) return;
            if (self.channelId && !(this as any).activeSession) {
                (this as any).activeSession = { start: Date.now(), channel: self.channelId };
            } else if (!self.channelId && (this as any).activeSession) {
                const session = (this as any).activeSession;
                const duration = Math.floor((Date.now() - session.start) / 60000);
                const sessions = getSessions();
                sessions.push({ channel: session.channel, duration, date: new Date().toDateString() });
                saveSessions(sessions);
                (this as any).activeSession = null;
            }
        }
    },
    commands: [{
        name: "timelog",
        description: "Show your voice channel time log",
        execute() {
            const sessions = getSessions().slice(-10).reverse();
            if (!sessions.length) return { content: "No time log entries yet" };
            const total = sessions.reduce((a: number, s: any) => a + s.duration, 0);
            return { content: `**Voice Time Log (last 10 sessions)**\n${sessions.map((s: any) => `${s.date}: ${s.duration} min in <#${s.channel}>`).join("\n")}\n\nTotal: ${total} min` };
        }
    }]
});
