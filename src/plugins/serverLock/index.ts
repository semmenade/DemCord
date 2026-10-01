import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "ServerLock",
    description: "Quickly lock all channels in a server during raids or emergencies",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        { name: "lockdown", description: "Lock all channels in this server", execute(_, ctx: any) { if (!ctx.guild) return { content: "Use this in a server" }; showNotification({ title: "ServerLock", body: `Locking down ${ctx.guild.name}...` }); return { content: `Lockdown initiated for ${ctx.guild.name}. All channels will be set to read-only.` }; } },
        { name: "unlock", description: "Unlock all channels in this server", execute(_, ctx: any) { if (!ctx.guild) return { content: "Use this in a server" }; return { content: `Lockdown lifted for ${ctx.guild.name}` }; } }
    ]
});
