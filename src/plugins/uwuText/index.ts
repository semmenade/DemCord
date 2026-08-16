import definePlugin from "@utils/types";
export default definePlugin({
    name: "UwuText",
    description: "Convert text to uwu speak",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "uwu",
        description: "Convert text to uwu speak",
        options: [{ name: "text", description: "Text to uwu-ify", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            const result = text.replace(/r|l/g, "w").replace(/R|L/g, "W").replace(/n([aeiou])/g, "ny$1").replace(/N([aeiou])/g, "Ny$1");
            return { content: result };
        }
    }]
});
