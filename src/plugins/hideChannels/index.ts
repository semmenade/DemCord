import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    hidden: { type: OptionType.STRING, description: "Hidden channel IDs (comma separated)", default: "" }
});

export default definePlugin({
    name: "HideChannels",
    description: "Hide specific channels from view without leaving them",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-hide-channels";
        document.head.appendChild(this.styleEl);
        this.apply();
    },

    apply() {
        const ids = settings.store.hidden.split(",").map((s: string) => s.trim()).filter(Boolean);
        if (this.styleEl) {
            this.styleEl.textContent = ids.map(id => `[data-dnd-name="${id}"], a[href*="${id}"] { display: none !important; }`).join("\n");
        }
    },

    commands: [
        {
            name: "hide",
            description: "Hide this channel from the sidebar",
            execute(_, ctx) {
                const hidden = settings.store.hidden.split(",").map((s: string) => s.trim()).filter(Boolean);
                if (!hidden.includes(ctx.channel.id)) hidden.push(ctx.channel.id);
                settings.store.hidden = hidden.join(",");
                return { content: `Channel hidden. Use /unhide to restore it.` };
            }
        },
        {
            name: "unhide",
            description: "Unhide a channel",
            options: [{ name: "channelid", description: "Channel ID to unhide", type: 3, required: true }],
            execute(opts) {
                const id = opts.find((o: any) => o.name === "channelid")?.value;
                const hidden = settings.store.hidden.split(",").map((s: string) => s.trim()).filter((h: string) => h !== id);
                settings.store.hidden = hidden.join(",");
                return { content: `Channel ${id} unhidden` };
            }
        }
    ],

    stop() { this.styleEl?.remove(); }
});
