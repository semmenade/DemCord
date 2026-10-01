import definePlugin from "@utils/types";
const zalgoChars = ["\u0300","\u0301","\u0302","\u0303","\u0308","\u0307","\u030A","\u030B","\u0323","\u0324","\u0325"];
export default definePlugin({
    name: "ZalgoText",
    description: "Convert text to creepy zalgo corrupted style",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "zalgo",
        description: "Convert text to zalgo style",
        options: [{ name: "text", description: "Text to zalgo-ify", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            const result = text.split("").map((c: string) => c + zalgoChars[Math.floor(Math.random() * zalgoChars.length)].repeat(Math.floor(Math.random() * 3) + 1)).join("");
            return { content: result };
        }
    }]
});
