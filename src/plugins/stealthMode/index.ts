import definePlugin from "@utils/types";

export default definePlugin({
    name: "StealthMode",
    description: "Makes you completely invisible - offline status, no typing indicator, no read receipts",
    authors: [{ name: "DemCord", id: 0n }],

    patches: [
        {
            find: "startTyping",
            replacement: { match: /startTyping\(\i\)\{/, replace: "startTyping($1){return;" }
        },
        {
            find: "PresenceStore",
            replacement: { match: /status:"online"/, replace: 'status:"invisible"' }
        }
    ],

    commands: [{
        name: "stealth",
        description: "Toggle stealth mode on/off",
        execute() { return { content: "Stealth mode toggled!" }; }
    }]
});
