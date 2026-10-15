import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    colors: { type: OptionType.STRING, description: "Server accent colors JSON {guildId: hex}", default: "{}", hidden: true }
});
function getColors() { try { return JSON.parse(settings.store.colors); } catch { return {}; } }
function saveColors(c: any) { settings.store.colors = JSON.stringify(c); }
export default definePlugin({
    name: "ServerAccentColor",
    description: "Set a different accent color for each server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-server-accent";
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); },
    commands: [{
        name: "server-color",
        description: "Set accent color for this server",
        options: [{ name: "color", description: "Hex color e.g. #ff0000", type: 3, required: true }],
        execute(opts: any[], ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const color = opts.find((o: any) => o.name === "color")?.value;
            const colors = getColors();
            colors[ctx.guild.id] = color;
            saveColors(colors);
            return { content: `Accent color set to ${color} for ${ctx.guild.name}` };
        }
    }]
});
