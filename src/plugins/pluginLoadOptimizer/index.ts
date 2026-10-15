import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable plugin load order optimization", default: true },
    deferHeavy: { type: OptionType.BOOLEAN, description: "Defer heavy plugins until after Discord loads", default: true }
});
const HEAVY_PLUGINS = ["MatrixRain","SnowEffect","SakuraEffect","AnimatedServerIcons","DemCordHUD","ServerRadio","demcordLogger"];
export default definePlugin({
    name: "PluginLoadOptimizer",
    description: "Optimizes plugin load order to reduce startup time and improve performance",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    start() {
        if (!settings.store.deferHeavy) return;
        for (const name of HEAVY_PLUGINS) {
            const plugin = DemCord?.Plugins?.plugins?.[name];
            if (!plugin?.started) continue;
            try { plugin.stop?.(); plugin.started = false; } catch {}
        }
        setTimeout(() => {
            for (const name of HEAVY_PLUGINS) {
                const plugin = DemCord?.Plugins?.plugins?.[name];
                if (!plugin || plugin.started) continue;
                try { plugin.start?.(); plugin.started = true; } catch {}
            }
        }, 5000);
    }
});
