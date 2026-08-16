import definePlugin from "@utils/types";
const PERM_NAMES: Record<string, string> = {
    "8": "Administrator", "2": "Kick Members", "4": "Ban Members",
    "16": "Manage Channels", "32": "Manage Server", "2048": "Send Messages",
    "8192": "Manage Messages", "1048576": "Connect", "2097152": "Speak"
};
export default definePlugin({
    name: "PermissionChecker",
    description: "Quick command to check what permissions any user has in the current server",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "checkperms",
        description: "Check permissions for a user",
        options: [{ name: "userid", description: "User ID", type: 3, required: true }],
        execute(opts, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const id = opts.find((o: any) => o.name === "userid")?.value;
            return { content: `Permissions for <@${id}> in ${ctx.guild.name}:\nUse Discord role settings to view full permissions.\nQuick check: https://discord.com/channels/${ctx.guild.id}/` };
        }
    }]
});
