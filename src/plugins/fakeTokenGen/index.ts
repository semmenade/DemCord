import definePlugin from "@utils/types";
export default definePlugin({
    name: "FakeTokenGen",
    description: "Generates plausible fake tokens to fool token scrapers and honeypot scripts",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "faketoken",
        description: "Generate a fake Discord token for honeypot use",
        execute() {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const part1 = btoa(Math.random().toString()).slice(0, 24).replace(/[^a-zA-Z0-9]/g, "x");
            const part2 = Array(6).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
            const part3 = Array(27).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
            return { content: `Fake token (honeypot use only):\n\`${part1}.${part2}.${part3}\`` };
        }
    }]
});
