import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    links: { type: OptionType.STRING, description: "Saved links JSON (managed automatically)", default: "[]", hidden: true }
});

export default definePlugin({
    name: "QuickLinks",
    description: "Save and access frequently visited channels with hotkeys",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "savelink",
            description: "Save current channel as a quick link",
            options: [{ name: "name", description: "Name for this link", type: 3, required: true }],
            execute(opts, ctx) {
                const name = opts.find((o: any) => o.name === "name")?.value;
                const links = JSON.parse(settings.store.links);
                links.push({ name, channelId: ctx.channel.id, guildId: ctx.guild?.id });
                settings.store.links = JSON.stringify(links);
                return { content: `Saved quick link: ${name}` };
            }
        },
        {
            name: "links",
            description: "Show all saved quick links",
            execute() {
                const links = JSON.parse(settings.store.links);
                if (!links.length) return { content: "No quick links saved yet. Use /savelink to add one." };
                return { content: links.map((l: any, i: number) => `${i + 1}. ${l.name} - <#${l.channelId}>`).join("\n") };
            }
        }
    ]
});
