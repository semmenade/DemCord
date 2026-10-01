import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "PluginDevTools",
    description: "Hot-reload plugins without restarting Discord during development",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "reload-plugin",
        description: "Reload a specific DemCord plugin",
        options: [{ name: "name", description: "Plugin name to reload", type: 3, required: true }],
        execute(opts) {
            const name = opts.find((o: any) => o.name === "name")?.value;
            try {
                const plugin = Vencord.Plugins.plugins[name];
                if (!plugin) return { content: `Plugin not found: ${name}` };
                if (plugin.stop) plugin.stop();
                if (plugin.start) plugin.start();
                showNotification({ title: "PluginDevTools", body: `Reloaded plugin: ${name}` });
                return { content: `Plugin reloaded: ${name}` };
            } catch (e: any) {
                return { content: `Failed to reload ${name}: ${e.message}` };
            }
        }
    }]
});
