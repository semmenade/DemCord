import definePlugin from "@utils/types";
export default definePlugin({
    name: "JsonFormatter",
    description: "Format and validate JSON directly in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "json",
        description: "Format and validate a JSON string",
        options: [{ name: "text", description: "JSON to format", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            try {
                const parsed = JSON.parse(text);
                return { content: `Valid JSON:\n\`\`\`json\n${JSON.stringify(parsed, null, 2).slice(0, 1800)}\n\`\`\`` };
            } catch (e: any) { return { content: `Invalid JSON: ${e.message}` }; }
        }
    }]
});
