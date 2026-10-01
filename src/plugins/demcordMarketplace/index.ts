import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const MARKETPLACE_URL = "https://raw.githubusercontent.com/semmenade/DemCord/master/marketplace.json";
export default definePlugin({
    name: "DemCordMarketplace",
    description: "Browse and install community themes and plugins from within DemCord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        {
            name: "marketplace",
            description: "Browse the DemCord marketplace",
            async execute() {
                try {
                    const res = await fetch(MARKETPLACE_URL);
                    if (!res.ok) return { content: "Marketplace unavailable. Check back later." };
                    const data = await res.json();
                    const plugins = data.plugins?.slice(0, 10) || [];
                    const themes = data.themes?.slice(0, 5) || [];
                    let content = "**DemCord Marketplace**\n\n";
                    if (plugins.length) content += `**Plugins:**\n${plugins.map((p: any) => `- ${p.name}: ${p.description}`).join("\n")}\n\n`;
                    if (themes.length) content += `**Themes:**\n${themes.map((t: any) => `- ${t.name}: ${t.description}`).join("\n")}`;
                    return { content: content || "Marketplace is empty." };
                } catch { return { content: "Could not reach marketplace." }; }
            }
        },
        {
            name: "marketplace-install",
            description: "Install a theme from a URL",
            options: [
                { name: "url", description: "Theme CSS URL", type: 3, required: true },
                { name: "name", description: "Theme name", type: 3, required: true }
            ],
            async execute(opts: any[]) {
                const url = opts.find((o: any) => o.name === "url")?.value;
                const name = opts.find((o: any) => o.name === "name")?.value;
                try {
                    const res = await fetch(url);
                    if (!res.ok) return { content: "Could not fetch theme" };
                    const css = await res.text();
                    const el = document.createElement("style");
                    el.id = `demcord-market-${name}`;
                    el.textContent = css;
                    document.head.appendChild(el);
                    showNotification({ title: "Marketplace", body: `Theme installed: ${name}` });
                    return { content: `Theme installed: ${name}` };
                } catch { return { content: "Failed to install theme" }; }
            }
        }
    ]
});
