import definePlugin from "@utils/types";
export default definePlugin({
    name: "ReverseText",
    description: "Reverse any text string",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "reverse",
        description: "Reverse text",
        options: [{ name: "text", description: "Text to reverse", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            return { content: text.split("").reverse().join("") };
        }
    }]
});
