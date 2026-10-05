import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable safe link opener", default: true },
    showPreview: { type: OptionType.BOOLEAN, description: "Show link preview before opening", default: true }
});
export default definePlugin({
    name: "SafeLinkOpener",
    description: "Shows a confirmation before opening any link from Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    start() {
        document.addEventListener("click", this._handler = (e: MouseEvent) => {
            if (!settings.store.enabled) return;
            const target = e.target as HTMLAnchorElement;
            const link = target.closest("a[href]") as HTMLAnchorElement;
            if (!link || !link.href.startsWith("http")) return;
            if (link.href.includes("discord.com") || link.href.includes("discordapp.com")) return;
            if (settings.store.showPreview) {
                e.preventDefault();
                e.stopPropagation();
                const confirm = window.confirm(`Open this link?\n\n${link.href}\n\nMake sure you trust this URL before proceeding.`);
                if (confirm) window.open(link.href, "_blank", "noopener,noreferrer");
            }
        }, true);
    },
    stop() { document.removeEventListener("click", this._handler, true); }
});
