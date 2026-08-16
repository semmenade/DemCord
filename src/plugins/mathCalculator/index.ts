import definePlugin from "@utils/types";
export default definePlugin({
    name: "MathCalculator",
    description: "Calculate math expressions directly in Discord with /calc",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "calc",
        description: "Calculate a math expression",
        options: [{ name: "expression", description: "Math expression e.g. 2+2 or sqrt(16)", type: 3, required: true }],
        execute(opts) {
            const expr = opts.find((o: any) => o.name === "expression")?.value;
            try {
                const result = Function(`"use strict"; return (${expr.replace(/[^0-9+\-*/().,\s^%sqrtabsceilflooroundinmax]/g, "")})`)();
                return { content: `${expr} = ${result}` };
            } catch { return { content: `Invalid expression: ${expr}` }; }
        }
    }]
});
