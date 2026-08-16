import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    list: { type: OptionType.STRING, description: "Watchlist data", default: "[]", hidden: true }
});
function getList() { try { return JSON.parse(settings.store.list); } catch { return []; } }
function saveList(l: any[]) { settings.store.list = JSON.stringify(l); }
export default definePlugin({
    name: "CoopWatchlist",
    description: "Track shows and movies to watch with friends",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "watch-add",
            description: "Add to watchlist",
            options: [
                { name: "title", description: "Show or movie title", type: 3, required: true },
                { name: "type", description: "movie or show", type: 3, required: false }
            ],
            execute(opts) {
                const title = opts.find((o: any) => o.name === "title")?.value;
                const type = opts.find((o: any) => o.name === "type")?.value || "unknown";
                const list = getList();
                list.push({ title, type, watched: false, added: new Date().toDateString() });
                saveList(list);
                return { content: `Added to watchlist: ${title} (${type})` };
            }
        },
        {
            name: "watchlist",
            description: "Show the watchlist",
            execute() {
                const list = getList().filter((i: any) => !i.watched);
                if (!list.length) return { content: "Watchlist is empty. Use /watch-add to add something." };
                return { content: `**Watchlist:**\n${list.map((i: any, n: number) => `${n + 1}. [${i.type}] ${i.title}`).join("\n")}` };
            }
        }
    ]
});
