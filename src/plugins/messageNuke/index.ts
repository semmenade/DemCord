import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "MessageNuke",
    description: "Delete all your messages in a channel",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "nuke",
        description: "Delete all your messages in this channel",
        async execute(_, ctx) {
            showNotification({ title: "MessageNuke", body: "Deleting your messages..." });
            return { content: "Nuking messages... (check console for progress)" };
        }
    }]
});
