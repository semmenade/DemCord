import definePlugin from "@utils/types";
const activity: Record<string, number> = {};
export default definePlugin({
    name: "ServerPulse",
    description: "Real-time activity indicator showing how busy each channel is right now",
    authors: [{ name: "DemCord", id: 0n }],
    interval: null as any,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.channel_id) return;
            activity[message.channel_id] = (activity[message.channel_id] || 0) + 1;
            setTimeout(() => { activity[message.channel_id] = Math.max(0, (activity[message.channel_id] || 1) - 1); }, 300000);
        }
    },
    commands: [{
        name: "pulse",
        description: "Show current server activity pulse",
        execute() {
            const sorted = Object.entries(activity).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 10);
            if (!sorted.length) return { content: "No recent activity tracked yet" };
            const bars = sorted.map(([ch, count]) => `<#${ch}>: ${"█".repeat(Math.min(count, 10))} (${count} msgs/5min)`);
            return { content: `**Server Pulse:**\n${bars.join("\n")}` };
        }
    }]
});
