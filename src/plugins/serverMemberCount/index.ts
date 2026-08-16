import definePlugin from "@utils/types";
export default definePlugin({
    name: "ServerMemberCount",
    description: "Shows exact member and online count in the server header",
    authors: [{ name: "DemCord", id: 0n }],
    patches: [{
        find: "guildHeaderCount",
        replacement: {
            match: /(?<=guildHeaderCount.{0,100})\i\.memberCount/,
            replace: "$& + ' members'"
        }
    }]
});
