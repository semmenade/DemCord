import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    colors: { type: OptionType.STRING, description: "User color assignments JSON", default: "{}", hidden: true }
});

function getColors() { try { return JSON.parse(settings.store.colors); } catch { return {}; } }
function saveColors(c: any) { settings.store.colors = JSON.stringify(c); }

export default definePlugin({
    name: "UserColorizer",
    description: "Assign custom colors to specific users names in chat",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-usercolors";
        document.head.appendChild(this.styleEl);
        this.applyColors();
    },

    applyColors() {
        const colors = getColors();
        if (this.styleEl) {
            this.styleEl.textContent = Object.entries(colors)
                .map(([id, color]) => `[data-author-id="${id}"] [class*="username"] { color: ${color} !important; }`)
                .join("\n");
        }
    },

    commands: [
        {
            name: "coloruser",
            description: "Set a custom color for a user",
            options: [
                { name: "userid", description: "User ID", type: 3, required: true },
                { name: "color", description: "Hex color e.g. #ff0000", type: 3, required: true }
            ],
            execute(opts) {
                const id = opts.find((o: any) => o.name === "userid")?.value;
                const color = opts.find((o: any) => o.name === "color")?.value;
                const colors = getColors();
                colors[id] = color;
                saveColors(colors);
                return { content: `Color set for user ${id}: ${color}` };
            }
        },
        {
            name: "coloruser-clear",
            description: "Remove custom color for a user",
            options: [{ name: "userid", description: "User ID", type: 3, required: true }],
            execute(opts) {
                const id = opts.find((o: any) => o.name === "userid")?.value;
                const colors = getColors();
                delete colors[id];
                saveColors(colors);
                return { content: `Color removed for user ${id}` };
            }
        }
    ],

    stop() { this.styleEl?.remove(); }
});
