import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    streaks: { type: OptionType.STRING, description: "Streak data", default: "{}", hidden: true }
});

function getStreaks() { try { return JSON.parse(settings.store.streaks); } catch { return {}; } }
function saveStreaks(s: any) { settings.store.streaks = JSON.stringify(s); }

export default definePlugin({
    name: "MessageStreak",
    description: "Tracks how many days in a row you have messaged someone",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            const streaks = getStreaks();
            const today = new Date().toDateString();
            const key = message.channel_id;
            if (!streaks[key]) streaks[key] = { days: 1, lastDate: today };
            else if (streaks[key].lastDate !== today) {
                streaks[key].days++;
                streaks[key].lastDate = today;
                if (streaks[key].days % 7 === 0) {
                    showNotification({ title: "Message Streak", body: `${streaks[key].days} day streak in this conversation!` });
                }
            }
            saveStreaks(streaks);
        }
    }
});
