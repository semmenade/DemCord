import definePlugin from "@utils/types";
export default definePlugin({
    name: "TextCleaner",
    description: "Remove formatting special characters and clean up text",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "clean",
        description: "Clean formatting from text",
        options: [{ name: "text", description: "Text to clean", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            const cleaned = text.replace(/[*_~`|>]/g, "").replace(/\s+/g, " ").trim();
            return { content: `Cleaned: ${cleaned}` };
        }
    }]
});
