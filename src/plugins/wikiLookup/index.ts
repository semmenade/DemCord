import definePlugin from "@utils/types";

export default definePlugin({
    name: "WikiLookup",
    description: "Pulls Wikipedia summaries inline with /wiki command",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "wiki",
        description: "Look up a topic on Wikipedia",
        options: [{ name: "topic", description: "Topic to search", type: 3, required: true }],
        async execute(opts) {
            const topic = opts.find((o: any) => o.name === "topic")?.value;
            try {
                const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
                const data = await res.json();
                if (data.type === "disambiguation") return { content: `Multiple results found for "${topic}". Try being more specific.` };
                return { content: `**${data.title}**\n${data.extract?.slice(0, 500)}...\n<${data.content_urls?.desktop?.page}>` };
            } catch {
                return { content: `Could not find Wikipedia article for "${topic}"` };
            }
        }
    }]
});
