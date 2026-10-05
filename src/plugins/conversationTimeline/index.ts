import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Timeline data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ConversationTimeline",
    description: "Visual timeline of your chat history with anyone",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (message.guild_id) return;
            const d = getData();
            const key = message.channel_id;
            if (!d[key]) d[key] = { messages: 0, firstSeen: Date.now(), lastSeen: Date.now() };
            d[key].messages++;
            d[key].lastSeen = Date.now();
            saveData(d);
        }
    },
    commands: [{
        name: "timeline",
        description: "Show conversation timeline for this DM",
        execute(_, ctx: any) {
            const d = getData();
            const conv = d[ctx.channel.id];
            if (!conv) return { content: "No timeline data for this conversation yet" };
            const days = Math.floor((Date.now() - conv.firstSeen) / 86400000);
            return { content: `**Conversation Timeline:**\nFirst message: ${new Date(conv.firstSeen).toDateString()}\nLast message: ${new Date(conv.lastSeen).toDateString()}\nTotal messages: ${conv.messages}\nConversation age: ${days} days` };
        }
    }]
});
