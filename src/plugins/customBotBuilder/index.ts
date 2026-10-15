import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    bots: { type: OptionType.STRING, description: "Custom bot definitions JSON", default: "[]", hidden: true }
});
function getBots() { try { return JSON.parse(settings.store.bots); } catch { return []; } }
function saveBots(b: any[]) { settings.store.bots = JSON.stringify(b); }
export default definePlugin({
    name: "CustomBotBuilder",
    description: "Create simple auto-response bots without coding",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.guild_id) return;
            const bots = getBots();
            for (const bot of bots) {
                if (message.content?.toLowerCase().includes(bot.trigger?.toLowerCase())) {
                    console.log(`[CustomBotBuilder] Would respond: ${bot.response}`);
                }
            }
        }
    },
    commands: [
        { name: "bot-add", description: "Add a bot response trigger", options: [{ name: "trigger", description: "Trigger phrase", type: 3, required: true }, { name: "response", description: "Bot response", type: 3, required: true }], execute(opts: any[]) { const trigger = opts.find((o: any) => o.name === "trigger")?.value; const response = opts.find((o: any) => o.name === "response")?.value; const bots = getBots(); bots.push({ trigger, response }); saveBots(bots); return { content: `Bot trigger added: "${trigger}" -> "${response}"` }; } },
        { name: "bot-list", description: "List all bot triggers", execute() { const bots = getBots(); if (!bots.length) return { content: "No bot triggers set" }; return { content: `**Bot Triggers:**\n${bots.map((b: any, i: number) => `${i+1}. "${b.trigger}" -> "${b.response}"`).join("\n")}` }; } }
    ]
});
