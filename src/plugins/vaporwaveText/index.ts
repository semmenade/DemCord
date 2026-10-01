import definePlugin from "@utils/types";
export default definePlugin({
    name: "VaporwaveText",
    description: "Convert text to aesthetic fullwidth vaporwave style",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "vaporwave",
        description: "Convert text to vaporwave style",
        options: [{ name: "text", description: "Text to convert", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            const result = text.split("").map((c: string) => {
                const code = c.charCodeAt(0);
                if (code >= 33 && code <= 126) return String.fromCharCode(code + 65248);
                return c === " " ? "\u3000" : c;
            }).join("");
            return { content: result };
        }
    }]
});
