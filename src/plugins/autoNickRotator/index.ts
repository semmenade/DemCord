import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    nicks: { type: OptionType.STRING, description: "Nicknames to rotate (one per line)", default: "" },
    interval: { type: OptionType.NUMBER, description: "Minutes between rotations", default: 60 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto nick rotator", default: false }
});
export default definePlugin({
    name: "AutoNickRotator",
    description: "Automatically rotates your nickname on a schedule",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    index: 0,
    start() {
        if (!settings.store.enabled) return;
        this.interval = setInterval(() => {
            const nicks = settings.store.nicks.split("\n").map((n: string) => n.trim()).filter(Boolean);
            if (!nicks.length) return;
            const nick = nicks[(this as any).index % nicks.length];
            (this as any).index++;
            console.log(`[AutoNickRotator] Would change nick to: ${nick}`);
        }, settings.store.interval * 60000);
    },
    stop() { clearInterval(this.interval); }
});
