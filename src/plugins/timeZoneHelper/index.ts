import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    timezones: { type: OptionType.STRING, description: "User timezones JSON (managed automatically)", default: "{}", hidden: true }
});

export default definePlugin({
    name: "TimeZoneHelper",
    description: "Shows everyone local time next to their username based on their set timezone",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "settimezone",
            description: "Set your timezone",
            options: [{ name: "timezone", description: "Timezone e.g. America/New_York", type: 3, required: true }],
            execute(opts, ctx) {
                const tz = opts.find((o: any) => o.name === "timezone")?.value;
                const tzs = JSON.parse(settings.store.timezones);
                tzs[ctx.channel.id] = tz;
                settings.store.timezones = JSON.stringify(tzs);
                const time = new Date().toLocaleTimeString("en-US", { timeZone: tz });
                return { content: `Timezone set to ${tz}. Your current time: ${time}` };
            }
        },
        {
            name: "time",
            description: "Show current time in any timezone",
            options: [{ name: "timezone", description: "Timezone e.g. America/New_York", type: 3, required: true }],
            execute(opts) {
                const tz = opts.find((o: any) => o.name === "timezone")?.value;
                const time = new Date().toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit" });
                return { content: `Current time in ${tz}: ${time}` };
            }
        }
    ]
});
