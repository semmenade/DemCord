import definePlugin from "@utils/types";
function snowflakeToDate(id: string) { return new Date(Number(BigInt(id) >> 22n) + 1420070400000); }
export default definePlugin({
    name: "MemberJoinAge",
    description: "Shows account creation date next to new member names",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        GUILD_MEMBER_ADD({ user }: any) {
            if (!user?.id) return;
            const created = snowflakeToDate(user.id);
            const days = Math.floor((Date.now() - created.getTime()) / 86400000);
            console.log(`[MemberJoinAge] ${user.username} account is ${days} days old (created ${created.toDateString()})`);
        }
    }
});
