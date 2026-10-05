import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable channel traffic lights", default: false },
    greenThreshold: { type: OptionType.NUMBER, description: "Messages per hour for green", default: 10 },
    yellowThreshold: { type: OptionType.NUMBER, description: "Messages per hour for yellow", default: 3 }
});
export default definePlugin({
    name: "ChannelTrafficLight",
    description: "Color codes channels green yellow red based on activity level",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    counts: new Map<string, number>(),
    styleEl: null as HTMLStyleElement | null,
    interval: null as any,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-traffic";
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); clearInterval(this.interval); },
    flux: {
        MESSAGE_CREATE({ message }: any) {
            const ch = message.channel_id;
            (this as any).counts.set(ch, ((this as any).counts.get(ch) || 0) + 1);
        }
    }
});
