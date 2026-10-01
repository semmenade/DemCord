import definePlugin from "@utils/types";

export default definePlugin({
    name: "ServerStats",
    description: "Shows live member and online count on server icons",
    authors: [{ name: "DemCord", id: 0n }],

    patches: [{
        find: "guildTooltip",
        replacement: {
            match: /(?<=guildTooltip.{0,200})\i\.name/,
            replace: "$&+`  `+(arguments[0]?.guild?.memberCount||``)"
        }
    }]
});

