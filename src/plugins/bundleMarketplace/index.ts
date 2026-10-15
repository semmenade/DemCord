import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const MARKETPLACE_API = "https://raw.githubusercontent.com/semmenade/DemCord/master/marketplace/bundles.json";
export default definePlugin({
    name: "BundleMarketplace",
    description: "Browse and install community preset bundles from the DemCord marketplace",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        { name: "bundles", description: "Browse available preset bundles", async execute() {
            try {
                const res = await fetch(MARKETPLACE_API);
                if (!res.ok) return { content: "Bundle marketplace unavailable. Submit your bundle at github.com/semmenade/DemCord" };
                const data = await res.json();
                return { content: `**DemCord Bundle Marketplace:**\n${data.map((b: any) => `**${b.name}** - ${b.description} (${b.price === 0 ? "Free" : b.price + " DP"})\nInstall: /bundle-install ${b.id}`).join("\n\n")}` };
            } catch { return { content: "Could not reach marketplace" }; }
        }},
        { name: "bundle-install", description: "Install a bundle by ID or file", options: [{ name: "id", description: "Bundle ID or upload a .json file", type: 3, required: true }], async execute(opts: any[]) {
            const id = opts.find((o: any) => o.name === "id")?.value;
            try {
                const res = await fetch(`https://raw.githubusercontent.com/semmenade/DemCord/master/marketplace/bundles/${id}.json`);
                if (!res.ok) return { content: `Bundle not found: ${id}` };
                const bundle = await res.json();
                const { Settings } = require("@api/Settings");
                let enabled = 0;
                for (const pluginName of bundle.plugins) {
                    if (Settings.plugins[pluginName] !== undefined) { Settings.plugins[pluginName] ??= {}; Settings.plugins[pluginName].enabled = true; enabled++; }
                }
                showNotification({ title: "Bundle Installed", body: `${bundle.name}: ${enabled} plugins enabled` });
                return { content: `Bundle installed: **${bundle.name}**\n${enabled} plugins enabled. Reload Discord to apply all changes.` };
            } catch { return { content: `Failed to install bundle: ${id}` }; }
        }}
    ]
});
