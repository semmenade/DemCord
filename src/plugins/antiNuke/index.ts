import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "AntiNuke",
    description: "Detects and alerts on mass channel deletion, role deletion, or mass ban attacks",
    authors: [{ name: "DemCord", id: 0n }],

    counts: { channelDeletes: 0, roleDeletes: 0, bans: 0, lastReset: Date.now() } as any,

    check(type: string) {
        const now = Date.now();
        if (now - (this as any).counts.lastReset > 10000) {
            (this as any).counts = { channelDeletes: 0, roleDeletes: 0, bans: 0, lastReset: now };
        }
        (this as any).counts[type]++;
        if ((this as any).counts[type] >= 3) {
            showNotification({
                title: "ANTI-NUKE ALERT",
                body: `Mass ${type} detected! Your server may be under attack!`,
                color: "#f38ba8",
                permanent: true
            });
        }
    },

    flux: {
        CHANNEL_DELETE() { (this as any).check("channelDeletes"); },
        GUILD_ROLE_DELETE() { (this as any).check("roleDeletes"); },
        GUILD_BAN_ADD() { (this as any).check("bans"); }
    }
});
