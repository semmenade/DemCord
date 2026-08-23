import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    minAge: { type: OptionType.NUMBER, description: "Minimum account age in days to interact", default: 30 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable age verification warnings", default: false }
});
function snowflakeToDate(id: string) { return new Date(Number(BigInt(id) >> 22n) + 1420070400000); }
export default definePlugin({
    name: "AgeVerification",
    description: "Warns when interacting with accounts younger than a set age",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled || !message.author?.id) return;
            const created = snowflakeToDate(message.author.id);
            const days = Math.floor((Date.now() - created.getTime()) / 86400000);
            if (days < settings.store.minAge) console.warn(`[AgeVerification] ${message.author.username} account is only ${days} days old`);
        }
    }
});
