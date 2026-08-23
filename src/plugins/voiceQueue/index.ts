import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const queues: Record<string, string[]> = {};
export default definePlugin({
    name: "VoiceQueue",
    description: "Lets users join a queue to speak in voice channels one at a time",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        { name: "queue-join", description: "Join the speak queue for this channel", execute(_, ctx: any) { const ch = ctx.channel.id; if (!queues[ch]) queues[ch] = []; const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id; if (!me) return { content: "Could not get your user ID" }; if (queues[ch].includes(me)) return { content: "You are already in the queue" }; queues[ch].push(me); return { content: `Added to queue. Position: ${queues[ch].length}` }; } },
        { name: "queue-next", description: "Move to next speaker in queue", execute(_, ctx: any) { const ch = ctx.channel.id; if (!queues[ch]?.length) return { content: "Queue is empty" }; const next = queues[ch].shift(); return { content: `Next speaker: <@${next}>` }; } },
        { name: "queue-list", description: "Show the current queue", execute(_, ctx: any) { const ch = ctx.channel.id; if (!queues[ch]?.length) return { content: "Queue is empty" }; return { content: `**Queue:**\n${queues[ch].map((id, i) => `${i + 1}. <@${id}>`).join("\n")}` }; } },
        { name: "queue-clear", description: "Clear the queue", execute(_, ctx: any) { queues[ctx.channel.id] = []; return { content: "Queue cleared" }; } }
    ]
});
