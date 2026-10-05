import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable event monitoring", default: false },
    filter: { type: OptionType.STRING, description: "Filter events by type (comma separated, empty = all)", default: "" }
});
export default definePlugin({
    name: "DiscordEventMonitor",
    description: "Live dashboard showing all Discord Flux events in real time",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    events: [] as any[],
    _dispatch: null as any,
    start() {
        this._dispatch = (event: any) => {
            if (!settings.store.enabled) return;
            const filters = settings.store.filter.split(",").map((f: string) => f.trim()).filter(Boolean);
            if (filters.length && !filters.some(f => event.type?.includes(f))) return;
            (this as any).events.push({ type: event.type, time: Date.now() });
            if ((this as any).events.length > 100) (this as any).events.shift();
        };
        const { FluxDispatcher } = require("@webpack/common");
        FluxDispatcher.register(this._dispatch);
    },
    stop() {
        const { FluxDispatcher } = require("@webpack/common");
        FluxDispatcher.unregister(this._dispatch);
    },
    commands: [{
        name: "events",
        description: "Show recent Discord events",
        execute() {
            const recent = (this as any).events.slice(-15).reverse();
            if (!recent.length) return { content: "No events captured. Enable the plugin and try again." };
            return { content: `**Recent Events:**\n${recent.map((e: any) => `${e.type} - ${new Date(e.time).toLocaleTimeString()}`).join("\n")}` };
        }
    }]
});
