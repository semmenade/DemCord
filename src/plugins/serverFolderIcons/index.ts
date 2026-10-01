import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    icons: { type: OptionType.STRING, description: "Folder icon mappings JSON", default: "{}", hidden: true }
});
export default definePlugin({
    name: "ServerFolderIcons",
    description: "Set custom icons for server folders in the sidebar",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [{
        name: "foldericon",
        description: "Set a custom icon for a server folder",
        options: [
            { name: "folderid", description: "Folder ID", type: 3, required: true },
            { name: "iconurl", description: "Icon image URL", type: 3, required: true }
        ],
        execute(opts) {
            const id = opts.find((o: any) => o.name === "folderid")?.value;
            const url = opts.find((o: any) => o.name === "iconurl")?.value;
            const icons = JSON.parse(settings.store.icons || "{}");
            icons[id] = url;
            settings.store.icons = JSON.stringify(icons);
            return { content: `Folder icon set for ${id}` };
        }
    }]
});
