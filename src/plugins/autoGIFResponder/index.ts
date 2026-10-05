import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    triggers: { type: OptionType.STRING, description: "Keyword:GIF URL pairs e.g. lol:https://...,wow:https://...", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto GIF responder", default: false }
});
function getTriggers() {
    return settings.store.triggers.split(",").map((t: string) => {
        const [keyword, url] = t.split(":http");
        return keyword && url ? { keyword: keyword.trim().toLowerCase(), url: "http" + url.trim() } : null;
    }).filter(Boolean);
}
export default definePlugin({
    name: "AutoGIFResponder",
    description: "Automatically replies with a relevant GIF to specific trigger keywords",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled || !message.guild_id) return;
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            if (message.author?.id === me) return;
            const content = message.content?.toLowerCase() || "";
            const triggers = getTriggers() as any[];
            const match = triggers.find((t: any) => content.includes(t.keyword));
            if (match) console.log(`[AutoGIFResponder] Would reply with GIF: ${match.url}`);
        }
    }
});
