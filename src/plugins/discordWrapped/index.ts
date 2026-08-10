import definePlugin from "@utils/types";

export default definePlugin({
    name: "DiscordWrapped",
    description: "Yearly stats summary like Spotify Wrapped showing your Discord activity",
    authors: [{ name: "DemCord", id: 0n }],

    stats: { messages: 0, reactions: 0, voiceMinutes: 0, servers: new Set<string>() } as any,

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            (this as any).stats.messages++;
        },
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            for (const s of voiceStates) {
                if (s.channelId) (this as any).stats.voiceMinutes++;
            }
        }
    },

    commands: [{
        name: "wrapped",
        description: "Show your DemCord session stats summary",
        execute() {
            const s = (this as any).stats;
            return { content: `**Your DemCord Stats**\nMessages sent: ${s.messages}\nReactions added: ${s.reactions}\nVoice time: ${s.voiceMinutes} min` };
        }
    }]
});
