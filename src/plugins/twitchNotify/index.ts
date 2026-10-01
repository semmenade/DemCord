import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    streamers: { type: OptionType.STRING, description: "Twitch usernames to watch (comma separated)", default: "" },
    clientId: { type: OptionType.STRING, description: "Twitch API Client ID", default: "" }
});

export default definePlugin({
    name: "TwitchNotify",
    description: "Get notified when your favorite Twitch streamers go live",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    interval: null as any,
    liveStatus: {} as Record<string, boolean>,

    start() {
        this.interval = setInterval(async () => {
            const streamers = settings.store.streamers.split(",").map((s: string) => s.trim()).filter(Boolean);
            if (!streamers.length || !settings.store.clientId) return;
            for (const streamer of streamers) {
                try {
                    const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamer}`, {
                        headers: { "Client-ID": settings.store.clientId, "Authorization": "" }
                    });
                    const data = await res.json();
                    const isLive = data.data?.length > 0;
                    if (isLive && !this.liveStatus[streamer]) {
                        showNotification({ title: "Twitch", body: `${streamer} is now live!`, onClick: () => window.open(`https://twitch.tv/${streamer}`) });
                    }
                    this.liveStatus[streamer] = isLive;
                } catch {}
            }
        }, 60000);
    },

    stop() { clearInterval(this.interval); }
});
