import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "BoostTracker",
    description: "Tracks server boosts and shows who boosted and when",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        GUILD_MEMBER_UPDATE({ guildId, user, premiumSince }: any) {
            if (!premiumSince) return;
            showNotification({ title: "Server Boost", body: `${user?.username} just boosted the server!` });
        }
    },
    commands: [{
        name: "boosts",
        description: "Show boost info for this server",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            return { content: `${ctx.guild.name} boost level: ${(ctx.guild as any).premiumTier || 0}\nTotal boosts: ${(ctx.guild as any).premiumSubscriptionCount || 0}` };
        }
    }]
});
