import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "TokenDefender",
    description: "Blocks attempts to steal your Discord token and alerts you with details",
    authors: [{ name: "DemCord", id: 0n }],
    required: true,

    start() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest.prototype.open;
        const token = document.cookie || "";

        window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
            const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
            const headers = init?.headers as Record<string, string> | undefined;
            if (headers?.["Authorization"] && !url.includes("discord.com") && !url.includes("discordapp.com")) {
                showNotification({
                    title: "⚠️ TOKEN THEFT BLOCKED",
                    body: `Something tried to steal your token!\nBlocked URL: ${url}\nChange your password immediately!`,
                    color: "#f38ba8",
                    permanent: true,
                    onClick: () => window.open("https://discord.com/settings/account")
                });
                console.error("[TokenDefender] Blocked token theft attempt to:", url);
                return new Response(null, { status: 403 });
            }
            return originalFetch.apply(this, [input, init] as any);
        };

        window.XMLHttpRequest.prototype.open = function(method: string, url: string, ...args: any[]) {
            (this as any)._dcUrl = url;
            return originalXHR.apply(this, [method, url, ...args] as any);
        };

        const originalSetHeader = window.XMLHttpRequest.prototype.setRequestHeader;
        window.XMLHttpRequest.prototype.setRequestHeader = function(header: string, value: string) {
            const url = (this as any)._dcUrl || "";
            if (header.toLowerCase() === "authorization" && !url.includes("discord.com") && !url.includes("discordapp.com")) {
                showNotification({
                    title: "⚠️ TOKEN THEFT BLOCKED",
                    body: `A script tried to use your token on: ${url}\nChange your password immediately!`,
                    color: "#f38ba8",
                    permanent: true,
                    onClick: () => window.open("https://discord.com/settings/account")
                });
                console.error("[TokenDefender] Blocked XHR token theft to:", url);
                return;
            }
            return originalSetHeader.apply(this, [header, value] as any);
        };
    },

    stop() {}
});
