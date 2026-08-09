import definePlugin from "@utils/types";

export default definePlugin({
    name: "FriendTracker",
    description: "Shows when friends went online/offline with timestamps",
    authors: [{ name: "DemCord", id: 0n }],

    flux: {
        PRESENCE_UPDATES({ updates }: any) {
            for (const update of updates) {
                const status = update.status;
                const userId = update.user?.id;
                if (userId) console.log(`[FriendTracker] ${userId} is now ${status} at ${new Date().toLocaleTimeString()}`);
            }
        }
    }
});
