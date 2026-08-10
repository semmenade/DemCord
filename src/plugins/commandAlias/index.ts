import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    aliases: { type: OptionType.STRING, description: "Command aliases JSON", default: "{}", hidden: true }
});

function getAliases() { try { return JSON.parse(settings.store.aliases); } catch { return {}; } }
function saveAliases(a: any) { settings.store.aliases = JSON.stringify(a); }

export default definePlugin({
    name: "CommandAlias",
    description: "Create custom slash command aliases for frequently used commands",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "alias-set",
            description: "Create a command alias",
            options: [
                { name: "alias", description: "Your alias name", type: 3, required: true },
                { name: "command", description: "Full command to run", type: 3, required: true }
            ],
            execute(opts) {
                const alias = opts.find((o: any) => o.name === "alias")?.value;
                const command = opts.find((o: any) => o.name === "command")?.value;
                const aliases = getAliases();
                aliases[alias] = command;
                saveAliases(aliases);
                return { content: `Alias created: /${alias} -> /${command}` };
            }
        },
        {
            name: "alias-list",
            description: "List all command aliases",
            execute() {
                const aliases = getAliases();
                const list = Object.entries(aliases).map(([k, v]) => `/${k} -> /${v}`).join("\n");
                return { content: list || "No aliases set. Use /alias-set to create one." };
            }
        }
    ]
});
