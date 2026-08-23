import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    points: { type: OptionType.STRING, description: "Points data", default: "{}", hidden: true },
    pointsPerMessage: { type: OptionType.NUMBER, description: "Points earned per message", default: 1 }
});
function getPoints() { try { return JSON.parse(settings.store.points); } catch { return {}; } }
function savePoints(p: any) { settings.store.points = JSON.stringify(p); }
export default definePlugin({
    name: "ChannelPoints",
    description: "Earn points for chatting and redeem rewards in your server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            if (message.author?.id !== me) return;
            const p = getPoints();
            p[me] = (p[me] || 0) + settings.store.pointsPerMessage;
            savePoints(p);
            if (p[me] % 100 === 0) showNotification({ title: "Channel Points", body: `You have earned ${p[me]} points!` });
        }
    },
    commands: [{
        name: "points",
        description: "Check your channel points",
        execute() {
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            const p = getPoints();
            return { content: `Your points: ${p[me] || 0}` };
        }
    }]
});
