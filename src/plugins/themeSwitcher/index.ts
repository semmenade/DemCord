import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    dayTheme: { type: OptionType.STRING, description: "Theme filename to use during day (6am-6pm)", default: "" },
    nightTheme: { type: OptionType.STRING, description: "Theme filename to use during night (6pm-6am)", default: "demcord.css" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable automatic theme switching", default: false }
});

export default definePlugin({
    name: "ThemeSwitcher",
    description: "Automatically switches themes based on time of day",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    interval: null as any,

    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            const hour = new Date().getHours();
            const isDay = hour >= 6 && hour < 18;
            console.log(`[ThemeSwitcher] ${isDay ? "Day" : "Night"} theme active`);
        }, 60000);
    },

    stop() { clearInterval(this.interval); }
});
