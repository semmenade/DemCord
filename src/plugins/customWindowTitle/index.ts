import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    title: { type: OptionType.STRING, description: "Custom window title", default: "DemCord" },
    showChannel: { type: OptionType.BOOLEAN, description: "Show current channel in title", default: true }
});
export default definePlugin({
    name: "CustomWindowTitle",
    description: "Set a custom Discord window title",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        document.title = settings.store.title;
        this.interval = setInterval(() => {
            const channel = document.querySelector("[class*='titleWrapper'] [class*='title']")?.textContent;
            document.title = settings.store.showChannel && channel ? `${channel} - ${settings.store.title}` : settings.store.title;
        }, 2000);
    },
    stop() { clearInterval(this.interval); document.title = "Discord"; }
});
