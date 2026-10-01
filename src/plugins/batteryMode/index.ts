import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    threshold: { type: OptionType.NUMBER, description: "Battery percentage to activate battery saver", default: 20 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable battery saver mode", default: true }
});

export default definePlugin({
    name: "BatterySaver",
    description: "Reduces animations and polling when running on battery",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,
    interval: null as any,

    start() {
        this.interval = setInterval(async () => {
            if (!settings.store.enabled) return;
            try {
                const battery = await (navigator as any).getBattery?.();
                if (!battery) return;
                if (!battery.charging && battery.level * 100 <= settings.store.threshold) {
                    if (!this.styleEl) {
                        this.styleEl = document.createElement("style");
                        this.styleEl.id = "demcord-battery";
                        this.styleEl.textContent = "* { animation: none !important; transition: none !important; }";
                        document.head.appendChild(this.styleEl);
                    }
                } else {
                    this.styleEl?.remove();
                    this.styleEl = null;
                }
            } catch {}
        }, 30000);
    },

    stop() {
        clearInterval(this.interval);
        this.styleEl?.remove();
    }
});
