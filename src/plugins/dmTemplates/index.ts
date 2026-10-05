import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    templates: { type: OptionType.STRING, description: "DM templates", default: '{"intro":"Hey! I saw you in {server} and wanted to reach out.","followup":"Just following up on our conversation from earlier!","thanks":"Thank you so much, I really appreciate it!"}', hidden: false }
});
function getTemplates() { try { return JSON.parse(settings.store.templates); } catch { return {}; } }
export default definePlugin({
    name: "DMTemplates",
    description: "Pre-written DM templates for common situations",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "dm-template", description: "Use a DM template", options: [{ name: "name", description: "Template name", type: 3, required: true }, { name: "server", description: "Server name to insert", type: 3, required: false }], execute(opts: any[]) { const name = opts.find((o: any) => o.name === "name")?.value; const server = opts.find((o: any) => o.name === "server")?.value || "the server"; const t = getTemplates(); if (!t[name]) return { content: `Template not found: ${name}. Available: ${Object.keys(t).join(", ")}` }; return { content: t[name].replace("{server}", server) }; } },
        { name: "dm-templates-list", description: "List all DM templates", execute() { const t = getTemplates(); return { content: `**DM Templates:**\n${Object.keys(t).map(k => `- ${k}`).join("\n")}` }; } }
    ]
});
