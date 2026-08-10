import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "MessageBouncer",
    description: "Automatically resends failed messages when connection is restored",
    authors: [{ name: "DemCord", id: 0n }],

    failedMessages: [] as any[],

    flux: {
        MESSAGE_SEND_FAILED({ message, channelId }: any) {
            (this as any).failedMessages.push({ message, channelId });
            showNotification({ title: "MessageBouncer", body: "Message failed - will retry when connection is restored" });
        },
        CONNECTION_OPEN() {
            const failed = (this as any).failedMessages.splice(0);
            if (failed.length) showNotification({ title: "MessageBouncer", body: `Resending ${failed.length} failed message(s)...` });
        }
    }
});
