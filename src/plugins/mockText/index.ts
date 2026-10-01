import definePlugin from "@utils/types";
export default definePlugin({
    name: "MockText",
    description: "Convert text to SpOnGeBoB mocking meme format",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "mock",
        description: "Convert text to mocking format",
        options: [{ name: "text", description: "Text to mock", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            const result = text.split("").map((c: string, i: number) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
            return { content: result };
        }
    }]
});
