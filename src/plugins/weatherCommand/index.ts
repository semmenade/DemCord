import definePlugin from "@utils/types";

export default definePlugin({
    name: "WeatherCommand",
    description: "Real-time weather for any city directly in Discord with /weather",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "weather",
        description: "Get current weather for a city",
        options: [{ name: "city", description: "City name", type: 3, required: true }],
        async execute(opts) {
            const city = opts.find((o: any) => o.name === "city")?.value;
            try {
                const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
                const text = await res.text();
                return { content: `Weather for ${city}: ${text.trim()}` };
            } catch {
                return { content: `Could not fetch weather for ${city}` };
            }
        }
    }]
});
