import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    signature: { type: OptionType.STRING, description: "Your professional signature", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Auto-append signature to messages", default: false }
});
export default definePlugin({
    name: "ProfessionalSignature",
    description: "Appends a professional signature to your messages optionally",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
