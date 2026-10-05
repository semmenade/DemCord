import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const THEMES_URL = "https://raw.githubusercontent.com/semmenade/DemCord/master/themes/marketplace.json";
export default definePlugin({
    name: "ThemeMarketplace",
    description: "Browse and install community themes like a proper app store",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        { name: "themes", description: "Browse available themes", async execute() { try { const res = await fetch(THEMES_URL); if (!res.ok) return { content: "Theme marketplace unavailable" }; const data = await res.json(); return { content: `**Available Themes:**\n${data.map((t: any) => `- **${t.name}**: ${t.description}\n  Install: /theme-install ${t.id}`).join("\n")}` }; } catch { return { content: "Could not reach theme marketplace" }; } } },
        { name: "theme-install", description: "Install a theme by ID or URL", options: [{ name: "id", description: "Theme ID or direct CSS URL", type: 3, required: true }], async execute(opts: any[]) { const id = opts.find((o: any) => o.name === "id")?.value; const url = id.startsWith("http") ? id : `https://raw.githubusercontent.com/semmenade/DemCord/master/themes/${id}.css`; try { const res = await fetch(url); if (!res.ok) return { content: `Theme not found: ${id}` }; const css = await res.text(); const el = document.createElement("style"); el.id = `demcord-theme-${id}`; el.textContent = css; document.head.appendChild(el); showNotification({ title: "ThemeMarketplace", body: `Theme installed: ${id}` }); return { content: `Theme installed: ${id}` }; } catch { return { content: `Failed to install theme: ${id}` }; } } },
        { name: "theme-remove", description: "Remove an installed marketplace theme", options: [{ name: "id", description: "Theme ID", type: 3, required: true }], execute(opts: any[]) { const id = opts.find((o: any) => o.name === "id")?.value; document.getElementById(`demcord-theme-${id}`)?.remove(); return { content: `Theme removed: ${id}` }; } }
    ]
});
