import definePlugin from "@utils/types";

export default definePlugin({
    name: "InvisibleTyping",
    description: "Stops Discord from showing that you are typing",
    authors: [{ name: "DemCord", id: 0n }],

    patches: [{
        find: "startTyping",
        replacement: {
            match: /startTyping\((\i)\){/,
            replace: "startTyping($1){return;"
        }
    }]
});
