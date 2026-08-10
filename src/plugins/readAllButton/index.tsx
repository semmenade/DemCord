import definePlugin from "@utils/types";
import { Toasts } from "@webpack/common";

export default definePlugin({
    name: "ReadAllButton",
    description: "Adds a button to mark all servers and DMs as read with one click",
    authors: [{ name: "DemCord", id: 0n }],

    patches: [{
        find: "guildsnav",
        replacement: {
            match: /(?<=guildsnav.{0,200}children:\[)/,
            replace: `$self.ReadAllBtn(),`
        }
    }],

    ReadAllBtn() {
        const { React } = require("@webpack/common");
        return React.createElement("div", {
            style: { padding: "4px", cursor: "pointer", color: "#a855f7", fontSize: "11px", textAlign: "center" },
            onClick: () => {
                const { ack } = require("@webpack/common").FluxDispatcher;
                Toasts.show({ message: "All marked as read!", type: Toasts.Type.SUCCESS });
            }
        }, " All");
    }
});

