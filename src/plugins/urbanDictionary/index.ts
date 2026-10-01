import definePlugin from "@utils/types";

export default definePlugin({
    name: "UrbanDictionary",
    description: "Look up any slang with /define using Urban Dictionary",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "define",
        description: "Look up a word on Urban Dictionary",
        options: [{ name: "word", description: "Word to define", type: 3, required: true }],
        async execute(opts) {
            const word = opts.find((o: any) => o.name === "word")?.value;
            try {
                const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
                const data = await res.json();
                if (!data.list?.length) return { content: `No definition found for "${word}"` };
                const def = data.list[0];
                return { content: `**${def.word}**\n${def.definition.slice(0, 400)}\n\n*Example: ${def.example?.slice(0, 200) || "N/A"}*` };
            } catch {
                return { content: `Could not fetch definition for "${word}"` };
            }
        }
    }]
});
