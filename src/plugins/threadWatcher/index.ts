import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    watched: { type: OptionType.STRING, description: "Thread IDs to watch (comma separated)", default: "" }
});
export default definePlugin({
    name: "ThreadWatcher",
    description: "Get notified of activity in specific threads",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            const watched = settings.store.watched.split(",").map((s: string) => s.trim()).filter(Boolean);
            if (!watched.includes(message.channel_id)) return;
            showNotification({ title: "ThreadWatcher", body: `New message in watched thread from ${message.author?.username}` });
        }
    },
    commands: [
        { name: "watch-thread", description: "Watch this thread for activity", execute(_, ctx: any) { const w = settings.store.watched.split(",").map((s: string) => s.trim()).filter(Boolean); if (!w.includes(ctx.channel.id)) w.push(ctx.channel.id); settings.store.watched = w.join(","); return { content: "Thread added to watchlist" }; } },
        { name: "unwatch-thread", description: "Stop watching this thread", execute(_, ctx: any) { settings.store.watched = settings.store.watched.split(",").map((s: string) => s.trim()).filter((id: string) => id !== ctx.channel.id).join(","); return { content: "Thread removed from watchlist" }; } }
    ]
});
