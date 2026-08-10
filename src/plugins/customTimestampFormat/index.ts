import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    format: { type: OptionType.STRING, description: "Time format: 12h or 24h or relative", default: "12h" },
    showSeconds: { type: OptionType.BOOLEAN, description: "Show seconds in timestamps", default: false }
});
export default definePlugin({
    name: "CustomTimestampFormat",
    description: "Customize how timestamps appear on messages",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    patches: [{
        find: "renderCozy",
        replacement: {
            match: /(?<=timestamp.{0,100})\i\.format\(\)/,
            replace: "$self.formatTime($&)"
        }
    }],
    formatTime(date: Date) {
        const opts: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            second: settings.store.showSeconds ? "2-digit" : undefined,
            hour12: settings.store.format === "12h"
        };
        return new Date(date).toLocaleTimeString([], opts);
    }
});
