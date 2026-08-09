import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    statuses: { type: OptionType.STRING, description: "Comma separated statuses to rotate", default: "gaming,coding,vibing" },
    interval: { type: OptionType.NUMBER, description: "Interval in seconds", default: 60 }
});

export default definePlugin({
    name: "StatusRotator",
    description: "Automatically cycles through custom statuses",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,

    start() {
        const statuses = settings.store.statuses.split(",").map(s => s.trim());
        let i = 0;
        this.interval = setInterval(() => {
            i = (i + 1) % statuses.length;
        }, settings.store.interval * 1000);
    },

    stop() { clearInterval(this.interval); }
});
