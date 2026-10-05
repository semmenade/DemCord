import definePlugin from "@utils/types";
export default definePlugin({
    name: "InvisibleMode",
    description: "Appear completely offline to everyone while still using Discord normally",
    authors: [{ name: "DemCord", id: 0n }],
    patches: [{
        find: "SET_CURRENT_USER_PRESENCE",
        replacement: {
            match: /status:"online"/g,
            replace: 'status:"invisible"'
        }
    }],
    commands: [{
        name: "invisible",
        description: "Toggle invisible mode",
        execute() {
            return { content: "Invisible mode is controlled by the plugin. Enable/disable the InvisibleMode plugin to toggle." };
        }
    }]
});
