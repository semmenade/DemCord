import definePlugin from "@utils/types";
export default definePlugin({
    name: "DiffViewer",
    description: "Compare two texts and show the differences",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "diff",
        description: "Compare two texts",
        options: [
            { name: "text1", description: "First text", type: 3, required: true },
            { name: "text2", description: "Second text", type: 3, required: true }
        ],
        execute(opts) {
            const t1 = opts.find((o: any) => o.name === "text1")?.value;
            const t2 = opts.find((o: any) => o.name === "text2")?.value;
            const w1 = t1.split(" ");
            const w2 = t2.split(" ");
            const added = w2.filter((w: string) => !w1.includes(w));
            const removed = w1.filter((w: string) => !w2.includes(w));
            return { content: `**Diff:**\nAdded: ${added.join(", ") || "none"}\nRemoved: ${removed.join(", ") || "none"}` };
        }
    }]
});
