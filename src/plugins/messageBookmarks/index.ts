import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    bookmarks: { type: OptionType.STRING, description: "Bookmarks data", default: "[]", hidden: true }
});
function getBookmarks() { try { return JSON.parse(settings.store.bookmarks); } catch { return []; } }
function saveBookmarks(b: any[]) { settings.store.bookmarks = JSON.stringify(b); }
export default definePlugin({
    name: "MessageBookmarks",
    description: "Bookmark messages like tweets with a sidebar view",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    contextMenus: {
        "message"(children: any[], { message }: any) {
            children.push({ type: "item", id: "demcord-bookmark", label: "Bookmark Message", action() {
                const b = getBookmarks();
                b.push({ id: message.id, content: message.content, author: message.author?.username, channelId: message.channel_id, time: new Date().toLocaleString() });
                saveBookmarks(b);
                showNotification({ title: "MessageBookmarks", body: "Message bookmarked" });
            }});
        }
    },
    commands: [
        { name: "bookmarks", description: "Show your bookmarked messages", execute() { const b = getBookmarks(); if (!b.length) return { content: "No bookmarks yet. Right-click a message to bookmark it." }; return { content: `**Bookmarks (${b.length}):**\n${b.slice(-10).map((bm: any, i: number) => `${i+1}. [${bm.author}] ${bm.content?.slice(0,80)}`).join("\n")}` }; } },
        { name: "bookmark-clear", description: "Clear all bookmarks", execute() { saveBookmarks([]); return { content: "All bookmarks cleared" }; } }
    ]
});
