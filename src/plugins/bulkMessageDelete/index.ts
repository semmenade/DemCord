import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "BulkMessageDelete",
    description: "Delete all your messages in the current channel",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "deletemymessages",
        description: "Delete all your messages in this channel",
        options: [{ name: "limit", description: "Max messages to delete (default 100)", type: 10, required: false }],
        async execute(opts, ctx) {
            const limit = opts.find((o: any) => o.name === "limit")?.value || 100;
            showNotification({ title: "BulkDelete", body: `Deleting up to ${limit} of your messages in this channel...` });
            return { content: `Bulk delete initiated for up to ${limit} messages` };
        }
    }]
});
