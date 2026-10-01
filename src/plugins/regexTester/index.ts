import definePlugin from "@utils/types";
export default definePlugin({
    name: "RegexTester",
    description: "Test regular expressions directly in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "regex",
        description: "Test a regex pattern against text",
        options: [
            { name: "pattern", description: "Regex pattern", type: 3, required: true },
            { name: "text", description: "Text to test", type: 3, required: true },
            { name: "flags", description: "Flags e.g. gi", type: 3, required: false }
        ],
        execute(opts) {
            const pattern = opts.find((o: any) => o.name === "pattern")?.value;
            const text = opts.find((o: any) => o.name === "text")?.value;
            const flags = opts.find((o: any) => o.name === "flags")?.value || "g";
            try {
                const regex = new RegExp(pattern, flags);
                const matches = text.match(regex);
                return { content: `Pattern: \`${pattern}\`\nText: ${text}\nMatches: ${matches ? matches.join(", ") : "No matches"}` };
            } catch (e: any) { return { content: `Invalid regex: ${e.message}` }; }
        }
    }]
});
