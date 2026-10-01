import definePlugin from "@utils/types";

export default definePlugin({
    name: "EmojiMixer",
    description: "Combine two emojis into a new one using Google Emoji Kitchen",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "emojimix",
        description: "Mix two emojis together",
        options: [
            { name: "emoji1", description: "First emoji", type: 3, required: true },
            { name: "emoji2", description: "Second emoji", type: 3, required: true }
        ],
        execute(opts) {
            const e1 = opts.find((o: any) => o.name === "emoji1")?.value;
            const e2 = opts.find((o: any) => o.name === "emoji2")?.value;
            const url = `https://emojikitchen.dev/?e1=${encodeURIComponent(e1)}&e2=${encodeURIComponent(e2)}`;
            return { content: `Emoji mix result: ${url}` };
        }
    }]
});
