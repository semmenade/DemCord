import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    learnedChannels: { type: OptionType.STRING, description: "Channels you care about", default: "[]", hidden: true },
    enabled: { type: OptionType.BOOLEAN, description: "Enable smart notifications", default: false }
});
function getLearned() { try { return JSON.parse(settings.store.learnedChannels); } catch { return []; } }
export default definePlugin({
    name: "SmartNotifications",
    description: "Learns which channels you care about and filters the rest",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interactions: new Map<string, number>(),
    flux: {
        CHANNEL_SELECT({ channelId }: any) {
            if (!channelId) return;
            const count = ((this as any).interactions.get(channelId) || 0) + 1;
            (this as any).interactions.set(channelId, count);
            if (count >= 5) {
                const learned = getLearned();
                if (!learned.includes(channelId)) { learned.push(channelId); settings.store.learnedChannels = JSON.stringify(learned); }
            }
        }
    }
});
