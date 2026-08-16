import definePlugin from "@utils/types";
export default definePlugin({
    name: "ColorPicker",
    description: "Pick any color and get its hex RGB and HSL values",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "color",
        description: "Get info about a color",
        options: [{ name: "hex", description: "Hex color code e.g. #a855f7", type: 3, required: true }],
        execute(opts) {
            const hex = opts.find((o: any) => o.name === "hex")?.value.replace("#", "");
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return { content: `Color: #${hex}\nRGB: rgb(${r}, ${g}, ${b})\nDecimal: ${parseInt(hex, 16)}` };
        }
    }]
});
