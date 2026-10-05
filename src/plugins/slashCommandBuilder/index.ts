import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    customCommands: { type: OptionType.STRING, description: "Custom commands JSON", default: "[]", hidden: true }
});
function getCommands() { try { return JSON.parse(settings.store.customCommands); } catch { return []; } }
function saveCommands(c: any[]) { settings.store.customCommands = JSON.stringify(c); }
export default definePlugin({
    name: "SlashCommandBuilder",
    description: "Build and test custom slash commands without coding",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "cmd-create", description: "Create a custom slash command", options: [{ name: "name", description: "Command name", type: 3, required: true }, { name: "response", description: "Response text", type: 3, required: true }], execute(opts: any[]) { const name = opts.find((o: any) => o.name === "name")?.value; const response = opts.find((o: any) => o.name === "response")?.value; const cmds = getCommands(); cmds.push({ name, response }); saveCommands(cmds); return { content: `Custom command created: /${name}` }; } },
        { name: "cmd-list", description: "List all custom commands", execute() { const cmds = getCommands(); if (!cmds.length) return { content: "No custom commands yet. Use /cmd-create to make one." }; return { content: `**Custom Commands:**\n${cmds.map((c: any) => `/${c.name} -> ${c.response?.slice(0, 50)}`).join("\n")}` }; } }
    ]
});
