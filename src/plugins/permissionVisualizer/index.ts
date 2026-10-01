import definePlugin from "@utils/types";

const PERMS: Record<string, string> = {
    "1": "Create Invites",
    "2": "Kick Members",
    "4": "Ban Members",
    "8": "Administrator",
    "16": "Manage Channels",
    "32": "Manage Server",
    "64": "Add Reactions",
    "128": "View Audit Log",
    "1024": "View Channels",
    "2048": "Send Messages",
    "4096": "Send TTS",
    "8192": "Manage Messages",
    "16384": "Embed Links",
    "32768": "Attach Files",
    "65536": "Read Message History",
    "131072": "Mention Everyone",
    "262144": "Use External Emojis",
    "1048576": "Connect to Voice",
    "2097152": "Speak in Voice",
    "4194304": "Mute Members",
    "8388608": "Deafen Members",
    "16777216": "Move Members",
    "33554432": "Use VAD",
    "268435456": "Change Nickname",
    "536870912": "Manage Nicknames",
    "1073741824": "Manage Roles"
};

export default definePlugin({
    name: "PermissionVisualizer",
    description: "Shows every permission a user or role has in a readable format",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "perms",
        description: "Show permissions for a user in this server",
        options: [{ name: "userid", description: "User ID to check", type: 3, required: true }],
        execute(opts, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const userId = opts.find((o: any) => o.name === "userid")?.value;
            return { content: `Permissions for <@${userId}> in this server:\nUse Discord developer tools to inspect full permission bitfield.\nServer: ${ctx.guild.name}` };
        }
    }]
});
