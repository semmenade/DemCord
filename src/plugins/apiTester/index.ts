import definePlugin from "@utils/types";
export default definePlugin({
    name: "ApiTester",
    description: "Built-in Discord API explorer and tester directly in the client",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "api",
        description: "Make a Discord API request",
        options: [
            { name: "endpoint", description: "API endpoint e.g. /users/@me", type: 3, required: true },
            { name: "method", description: "HTTP method GET POST PATCH DELETE", type: 3, required: false }
        ],
        async execute(opts) {
            const endpoint = opts.find((o: any) => o.name === "endpoint")?.value;
            const method = opts.find((o: any) => o.name === "method")?.value || "GET";
            try {
                const res = await fetch(`https://discord.com/api/v9${endpoint}`, { method });
                const data = await res.json();
                return { content: `**API ${method} ${endpoint}** (${res.status})\n\`\`\`json\n${JSON.stringify(data, null, 2).slice(0, 1500)}\n\`\`\`` };
            } catch (e: any) {
                return { content: `API request failed: ${e.message}` };
            }
        }
    }]
});
