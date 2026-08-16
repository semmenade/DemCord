import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    availability: { type: OptionType.STRING, description: "Your availability schedule", default: "" }
});
export default definePlugin({
    name: "TeamAvailability",
    description: "Show your availability and see team members availability in real-time",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "available",
            description: "Set your availability",
            options: [{ name: "hours", description: "Available hours e.g. 9am-5pm EST", type: 3, required: true }],
            execute(opts) {
                const hours = opts.find((o: any) => o.name === "hours")?.value;
                settings.store.availability = hours;
                return { content: `Availability set: ${hours}` };
            }
        },
        {
            name: "myavailability",
            description: "Show your current availability",
            execute() {
                return { content: settings.store.availability ? `Your availability: ${settings.store.availability}` : "No availability set. Use /available to set it." };
            }
        }
    ]
});
