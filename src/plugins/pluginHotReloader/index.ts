import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "PluginHotReloader",
    description: "Reload any DemCord plugin without restarting Discord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        { name: "reload", description: "Reload a plugin by name", options: [{ name: "name", description: "Plugin name", type: 3, required: true }], execute(opts: any[]) { const name = opts.find((o: any) => o.name === "name")?.value; const plugin = DemCord.Plugins.plugins[name]; if (!plugin) return { content: `Plugin not found: ${name}` }; try { plugin.stop?.(); plugin.started = false; plugin.start?.(); plugin.started = true; showNotification({ title: "PluginHotReloader", body: `Reloaded: ${name}` }); return { content: `Plugin reloaded: ${name}` }; } catch(e: any) { return { content: `Failed to reload ${name}: ${e.message}` }; } } },
        { name: "reload-all", description: "Reload all non-core plugins", execute() { let count = 0; Object.entries(DemCord.Plugins.plugins).forEach(([name, plugin]: any) => { if (plugin.required) return; try { plugin.stop?.(); plugin.started = false; plugin.start?.(); plugin.started = true; count++; } catch {} }); return { content: `Reloaded ${count} plugins` }; } }
    ]
});
