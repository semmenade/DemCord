import definePlugin from "@utils/types";
export default definePlugin({
    name: "FriendMap",
    description: "Shows approximate locations of friends based on their timezone",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "friendmap",
        description: "Show where your friends are approximately located",
        execute() {
            return { content: "Friend map data is based on timezones set via /settimezone. Install the TimeZoneHelper plugin to collect data." };
        }
    }]
});
