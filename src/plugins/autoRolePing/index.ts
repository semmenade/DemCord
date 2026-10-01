import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    rules: { type: OptionType.STRING, description: "Rules JSON: [{trigger,roleId,guildId}]", default: "[]", hidden: true }
});
function getRules() { try { return JSON.parse(settings.store.rules); } catch { return []; } }
function saveRules(r: any[]) { settings.store.rules = JSON.stringify(r); }
export default definePlugin({
    name: "AutoRolePing",
    description: "Automatically pings a role when your message contains specific trigger words",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "autoping-add",
            description: "Add an auto role ping rule",
            options: [
                { name: "trigger", description: "Trigger word", type: 3, required: true },
                { name: "roleid", description: "Role ID to ping", type: 3, required: true }
            ],
            execute(opts: any[], ctx: any) {
                const trigger = opts.find((o: any) => o.name === "trigger")?.value;
                const roleId = opts.find((o: any) => o.name === "roleid")?.value;
                const rules = getRules();
                rules.push({ trigger, roleId, guildId: ctx.guild?.id });
                saveRules(rules);
                return { content: `Auto ping rule added: "${trigger}" -> <@&${roleId}>` };
            }
        },
        {
            name: "autoping-list",
            description: "List all auto ping rules",
            execute() {
                const rules = getRules();
                if (!rules.length) return { content: "No auto ping rules set." };
                return { content: `**Auto Ping Rules:**\n${rules.map((r: any, i: number) => `${i + 1}. "${r.trigger}" -> <@&${r.roleId}>`).join("\n")}` };
            }
        }
    ]
});
