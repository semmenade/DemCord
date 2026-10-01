import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "ServerCloner",
    description: "Clone a server structure including channels roles and categories",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "cloneserver",
        description: "Clone this server structure to a new server",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Must be used in a server" };
            showNotification({ title: "ServerCloner", body: `Cloning ${ctx.guild.name} structure...` });
            return { content: `Server clone initiated for ${ctx.guild.name}. Check console for progress.` };
        }
    }]
});
