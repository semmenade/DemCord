import definePlugin from "@utils/types";
export default definePlugin({
    name: "MarkdownPreview",
    description: "Preview how your markdown will render before sending",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "preview",
        description: "Preview markdown rendering",
        options: [{ name: "text", description: "Text with markdown to preview", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            return { content: `Preview:\n${text}` };
        }
    }]
});
