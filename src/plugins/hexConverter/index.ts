import definePlugin from "@utils/types";
export default definePlugin({
    name: "HexConverter",
    description: "Convert between hex decimal binary and other number bases",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "convert",
        description: "Convert a number between bases",
        options: [
            { name: "number", description: "Number to convert", type: 3, required: true },
            { name: "from", description: "Base to convert from: dec hex bin oct", type: 3, required: true },
            { name: "to", description: "Base to convert to: dec hex bin oct", type: 3, required: true }
        ],
        execute(opts) {
            const num = opts.find((o: any) => o.name === "number")?.value;
            const from = opts.find((o: any) => o.name === "from")?.value;
            const to = opts.find((o: any) => o.name === "to")?.value;
            const bases: Record<string, number> = { dec: 10, hex: 16, bin: 2, oct: 8 };
            const decimal = parseInt(num, bases[from]);
            const result = decimal.toString(bases[to]);
            return { content: `${num} (${from}) = ${result} (${to})` };
        }
    }]
});
