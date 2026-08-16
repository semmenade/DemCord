import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    count: { type: OptionType.NUMBER, description: "Total messages sent this session", default: 0 }
});
export default definePlugin({
    name: "MessageCounter",
    description: "Counts total messages you have sent and shows milestones",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            settings.store.count++;
        }
    },
    commands: [{
        name: "msgcount",
        description: "Show your message count this session",
        execute() {
            return { content: `Messages sent this session: ${settings.store.count}` };
        }
    }]
});
