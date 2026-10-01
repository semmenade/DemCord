import definePlugin from "@utils/types";
export default definePlugin({
    name: "ClapText",
    description: "Add clap between every word like the meme",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "clap",
        description: "Add clap between words",
        options: [{ name: "text", description: "Text", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            return { content: text.split(" ").join(" :clap: ") };
        }
    }]
});
