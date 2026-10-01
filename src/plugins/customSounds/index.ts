import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    messageSound: { type: OptionType.STRING, description: "URL to custom message sound (.mp3/.wav)", default: "" },
    mentionSound: { type: OptionType.STRING, description: "URL to custom mention sound (.mp3/.wav)", default: "" },
    dmSound: { type: OptionType.STRING, description: "URL to custom DM sound (.mp3/.wav)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable custom sounds", default: false }
});

function playSound(url: string) {
    if (!url) return;
    try { new Audio(url).play().catch(() => {}); } catch {}
}

export default definePlugin({
    name: "CustomSounds",
    description: "Replace Discord notification sounds with custom audio files",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!settings.store.enabled || optimistic) return;
            if (message.mentions?.length) playSound(settings.store.mentionSound);
            else if (!message.guild_id) playSound(settings.store.dmSound);
            else playSound(settings.store.messageSound);
        }
    }
});
