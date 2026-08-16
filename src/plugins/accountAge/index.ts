import definePlugin from "@utils/types";
function snowflakeToDate(id: string) { return new Date(Number(BigInt(id) >> 22n) + 1420070400000); }
export default definePlugin({
    name: "AccountAgeWarner",
    description: "Warns when receiving DMs from accounts less than 7 days old",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (message.guild_id) return;
            const id = message.author?.id;
            if (!id) return;
            const created = snowflakeToDate(id);
            const days = Math.floor((Date.now() - created.getTime()) / 86400000);
            if (days < 7) {
                import("@api/Notifications").then(({ showNotification }) => {
                    showNotification({ title: "New Account Warning", body: `${message.author?.username} account is only ${days} days old`, color: "#f38ba8" });
                });
            }
        }
    }
});
