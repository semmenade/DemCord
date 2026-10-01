import definePlugin from "@utils/types";
export default definePlugin({
    name: "Base64Tool",
    description: "Encode and decode base64 strings directly in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        {
            name: "b64encode",
            description: "Encode text to base64",
            options: [{ name: "text", description: "Text to encode", type: 3, required: true }],
            execute(opts) {
                const text = opts.find((o: any) => o.name === "text")?.value;
                return { content: `Encoded: ${btoa(unescape(encodeURIComponent(text)))}` };
            }
        },
        {
            name: "b64decode",
            description: "Decode base64 text",
            options: [{ name: "text", description: "Base64 to decode", type: 3, required: true }],
            execute(opts) {
                const text = opts.find((o: any) => o.name === "text")?.value;
                try { return { content: `Decoded: ${decodeURIComponent(escape(atob(text)))}` }; }
                catch { return { content: "Invalid base64 string" }; }
            }
        }
    ]
});
