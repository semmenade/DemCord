import definePlugin from "@utils/types";
export default definePlugin({
    name: "BundleCreator",
    description: "Package your current DemCord settings as a shareable preset bundle",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "bundle-create",
        description: "Create a bundle from your current settings",
        options: [
            { name: "name", description: "Bundle name", type: 3, required: true },
            { name: "description", description: "Bundle description", type: 3, required: true },
            { name: "price", description: "Price in DP (0 for free)", type: 10, required: false }
        ],
        execute(opts: any[]) {
            const name = opts.find((o: any) => o.name === "name")?.value;
            const desc = opts.find((o: any) => o.name === "description")?.value;
            const price = opts.find((o: any) => o.name === "price")?.value || 0;
            try {
                const { Settings } = require("@api/Settings");
                const bundle = {
                    name, description: desc, price,
                    plugins: Object.keys(Settings.plugins).filter(p => Settings.plugins[p]?.enabled),
                    created: new Date().toISOString(),
                    version: "2.5.0"
                };
                const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `demcord-bundle-${name.toLowerCase().replace(/\s/g,"-")}.json`;
                a.click();
                return { content: `Bundle created: ${name} (${bundle.plugins.length} plugins, ${price} DP)` };
            } catch { return { content: "Failed to create bundle" }; }
        }
    }]
});
