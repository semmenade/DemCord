import definePlugin from "@utils/types";
export default definePlugin({
    name: "DocumentCollab",
    description: "Share and collaborate on documents linked to Discord channels",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "doc-share",
        description: "Share a document link with the channel",
        options: [
            { name: "url", description: "Document URL", type: 3, required: true },
            { name: "title", description: "Document title", type: 3, required: true }
        ],
        execute(opts) {
            const url = opts.find((o: any) => o.name === "url")?.value;
            const title = opts.find((o: any) => o.name === "title")?.value;
            return { content: `**Document:** ${title}\n${url}\nClick to open and collaborate.` };
        }
    }]
});
