import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    templates: { type: OptionType.STRING, description: "Message templates JSON", default: "{}", hidden: true }
});
function getTemplates() { try { return JSON.parse(settings.store.templates); } catch { return {}; } }
function saveTemplates(t: any) { settings.store.templates = JSON.stringify(t); }
export default definePlugin({
    name: "MessageTemplates",
    description: "Save frequently typed messages as templates and insert them with a slash command",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "template-save",
            description: "Save a message template",
            options: [
                { name: "name", description: "Template name", type: 3, required: true },
                { name: "text", description: "Template text", type: 3, required: true }
            ],
            execute(opts) {
                const name = opts.find((o: any) => o.name === "name")?.value;
                const text = opts.find((o: any) => o.name === "text")?.value;
                const t = getTemplates();
                t[name] = text;
                saveTemplates(t);
                return { content: `Template saved: ${name}` };
            }
        },
        {
            name: "template-use",
            description: "Use a saved template",
            options: [{ name: "name", description: "Template name", type: 3, required: true }],
            execute(opts) {
                const name = opts.find((o: any) => o.name === "name")?.value;
                const t = getTemplates();
                if (!t[name]) return { content: `Template not found: ${name}` };
                return { content: t[name] };
            }
        },
        {
            name: "template-list",
            description: "List all templates",
            execute() {
                const t = getTemplates();
                const list = Object.keys(t);
                if (!list.length) return { content: "No templates saved. Use /template-save to create one." };
                return { content: `**Templates:**\n${list.join(", ")}` };
            }
        }
    ]
});
