import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    items: { type: OptionType.STRING, description: "Custom menu items JSON [{label,action}]", default: "[]", hidden: true }
});
function getItems() { try { return JSON.parse(settings.store.items); } catch { return []; } }
export default definePlugin({
    name: "CustomContextMenu",
    description: "Adds your own custom options to Discord right-click menus",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    contextMenus: {
        "message"(children: any[]) {
            const items = getItems();
            if (!items.length) return;
            children.push({ type: "separator" });
            items.forEach((item: any) => {
                children.push({ type: "item", id: `demcord-custom-${item.label}`, label: item.label, action() { console.log(`[CustomContextMenu] ${item.label} clicked`); } });
            });
        }
    },
    commands: [{
        name: "menu-add",
        description: "Add a custom context menu item",
        options: [{ name: "label", description: "Menu item label", type: 3, required: true }],
        execute(opts: any[]) {
            const label = opts.find((o: any) => o.name === "label")?.value;
            const items = getItems();
            items.push({ label });
            settings.store.items = JSON.stringify(items);
            return { content: `Added menu item: ${label}` };
        }
    }]
});
