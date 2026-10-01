import definePlugin from "@utils/types";
import { getCurrentChannel } from "@utils/discord";

export default definePlugin({
    name: "GhostTyping",
    description: "Makes you appear as typing without sending a message",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "ghosttype",
        description: "Start appearing as typing",
        execute(_, ctx) {
            const { startTyping } = require("@webpack/common").FluxDispatcher;
            setInterval(() => {
                VencordNative.native.openExternal(`discord://channels/${ctx.guild?.id || "@me"}/${ctx.channel.id}`);
            }, 8000);
            return { content: "Ghost typing started!" };
        }
    }]
});
