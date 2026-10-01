import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    replacements: { type: OptionType.STRING, description: "Word replacements JSON e.g. {old:new}", default: "{}", hidden: true }
});
function getReplacements() { try { return JSON.parse(settings.store.replacements); } catch { return {}; } }
function saveReplacements(r: any) { settings.store.replacements = JSON.stringify(r); }
export default definePlugin({
    name: "WordReplacer",
    description: "Auto-replaces specific words in your messages before sending",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "replace-add",
            description: "Add a word replacement",
            options: [
                { name: "from", description: "Word to replace", type: 3, required: true },
                { name: "to", description: "Replace with", type: 3, required: true }
            ],
            execute(opts) {
                const from = opts.find((o: any) => o.name === "from")?.value;
                const to = opts.find((o: any) => o.name === "to")?.value;
                const r = getReplacements();
                r[from] = to;
                saveReplacements(r);
                return { content: `Replacement added: ${from} -> ${to}` };
            }
        },
        {
            name: "replace-list",
            description: "List all word replacements",
            execute() {
                const r = getReplacements();
                const list = Object.entries(r).map(([k, v]) => `${k} -> ${v}`).join("\n");
                return { content: list || "No replacements set" };
            }
        }
    ]
});
