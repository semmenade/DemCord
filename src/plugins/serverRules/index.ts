import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    rules: { type: OptionType.STRING, description: "Server rules one per line", default: "" }
});
export default definePlugin({
    name: "ServerRules",
    description: "Store and display server rules with a slash command",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "rules", description: "Show server rules", execute() { const rules = settings.store.rules.split("\n").filter(Boolean); if (!rules.length) return { content: "No rules set. Use /setrules to add rules." }; return { content: `**Server Rules:**\n${rules.map((r: string, i: number) => `${i + 1}. ${r}`).join("\n")}` }; } },
        { name: "setrules", description: "Set server rules", options: [{ name: "rules", description: "Rules separated by | character", type: 3, required: true }], execute(opts: any[]) { const rules = opts.find((o: any) => o.name === "rules")?.value?.replace(/\|/g, "\n"); settings.store.rules = rules; return { content: "Rules updated" }; } }
    ]
});
