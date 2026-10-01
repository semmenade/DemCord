import definePlugin from "@utils/types";
export default definePlugin({
    name: "CustomOfflinePage",
    description: "Custom Discord offline page when connection drops",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        CONNECTION_CLOSED() {
            const existing = document.getElementById("demcord-offline");
            if (existing) return;
            const el = document.createElement("div");
            el.id = "demcord-offline";
            el.style.cssText = "position:fixed;top:0;left:0;width:100%;background:rgba(168,85,247,0.95);color:white;padding:12px;text-align:center;z-index:99999;font-weight:600;";
            el.textContent = "DemCord: Connection lost - attempting to reconnect...";
            document.body.appendChild(el);
        },
        CONNECTION_OPEN() { document.getElementById("demcord-offline")?.remove(); }
    }
});
