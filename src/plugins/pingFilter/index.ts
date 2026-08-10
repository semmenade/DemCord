import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    onlyDirectMentions: { type: OptionType.BOOLEAN, description: "Only notify on direct mentions", default: true },
    mutedKeywords: { type: OptionType.STRING, description: "Keywords to ignore in notifications (comma separated)", default: "" }
});

export default definePlugin({
    name: "PingFilter",
    description: "Filter notifications to only show when someone actually needs you",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    patches: [{
        find: "shouldNotify",
        replacement: {
            match: /shouldNotify\((\i),(\i)\)\{/,
            replace: "shouldNotify($1,$2){if($self.shouldBlock($1,$2))return false;"
        }
    }],

    shouldBlock(message: any, channel: any) {
        if (!settings.store.onlyDirectMentions) return false;
        const muted = settings.store.mutedKeywords.split(",").map((k: string) => k.trim().toLowerCase()).filter(Boolean);
        const content = message.content?.toLowerCase() || "";
        return muted.some((k: string) => content.includes(k));
    }
});
