import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    quotes: { type: OptionType.STRING, description: "Saved quotes", default: "[]", hidden: true }
});
function getQuotes() { try { return JSON.parse(settings.store.quotes); } catch { return []; } }
function saveQuotes(q: any[]) { settings.store.quotes = JSON.stringify(q); }
export default definePlugin({
    name: "QuoteWall",
    description: "Saves funny or memorable quotes from your servers",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    contextMenus: {
        "message"(children: any[], { message }: any) {
            children.push({ type: "item", id: "demcord-quote", label: "Add to Quote Wall", action() {
                const q = getQuotes();
                q.push({ content: message.content, author: message.author?.username, time: new Date().toDateString() });
                saveQuotes(q);
                showNotification({ title: "QuoteWall", body: "Quote saved!" });
            }});
        }
    },
    commands: [
        { name: "quotes", description: "Show your quote wall", execute() { const q = getQuotes(); if (!q.length) return { content: "No quotes saved. Right-click a message to add one." }; const random = q[Math.floor(Math.random() * q.length)]; return { content: `**Random Quote:**\n"${random.content}"\n- ${random.author}, ${random.time}\n\n(${q.length} total quotes)` }; } },
        { name: "quotes-all", description: "Show all quotes", execute() { const q = getQuotes(); if (!q.length) return { content: "No quotes saved" }; return { content: `**Quote Wall (${q.length}):**\n${q.slice(-10).map((qt: any, i: number) => `${i+1}. "${qt.content?.slice(0,80)}" - ${qt.author}`).join("\n")}` }; } }
    ]
});
