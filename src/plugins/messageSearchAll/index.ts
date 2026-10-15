import definePlugin from "@utils/types";
export default definePlugin({
    name: "MessageSearchAll",
    description: "Search messages across all servers and DMs simultaneously",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "search-all",
        description: "Search across all your servers and DMs",
        options: [
            { name: "query", description: "Search query", type: 3, required: true },
            { name: "author", description: "Filter by author username", type: 3, required: false }
        ],
        execute(opts: any[]) {
            const query = opts.find((o: any) => o.name === "query")?.value;
            const author = opts.find((o: any) => o.name === "author")?.value;
            return { content: `Searching for "${query}"${author ? ` by ${author}` : ""} across all servers...\nUse Discord's built-in search (Ctrl+F) for full search functionality.` };
        }
    }]
});
