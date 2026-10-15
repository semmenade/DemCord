import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const KNOWN_CONFLICTS: [string, string, string][] = [
    ["MatrixRain", "SnowEffect", "Both use canvas overlay - may cause performance issues"],
    ["StealthMode", "InvisibleMode", "Both modify presence status - use only one"],
    ["NitroFaker", "FakeNitro", "Duplicate functionality - use only one"],
    ["CustomFonts", "DyslexiaFont", "Both modify Discord fonts - use only one"],
    ["TransparentDiscord", "DiscordWallpaper", "May conflict - enable background material in DemCord settings instead"],
    ["FluxOptimizer", "RequestDeduplicator", "Both patch fetch - may cause issues together"]
];
export default definePlugin({
    name: "PluginConflictDetector",
    description: "Warns when two plugins that conflict with each other are both enabled",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        setTimeout(() => {
            const active = new Set(Object.keys(DemCord?.Plugins?.plugins || {}).filter((p: string) => DemCord.Plugins.plugins[p]?.started));
            for (const [p1, p2, reason] of KNOWN_CONFLICTS) {
                if (active.has(p1) && active.has(p2)) {
                    showNotification({ title: "Plugin Conflict", body: `${p1} + ${p2}: ${reason}` });
                }
            }
        }, 5000);
    }
});
