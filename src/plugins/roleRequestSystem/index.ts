import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    requestable: { type: OptionType.STRING, description: "Requestable role IDs comma separated", default: "" },
    requests: { type: OptionType.STRING, description: "Pending requests", default: "[]", hidden: true }
});
function getRequests() { try { return JSON.parse(settings.store.requests); } catch { return []; } }
function saveRequests(r: any[]) { settings.store.requests = JSON.stringify(r); }
export default definePlugin({
    name: "RoleRequestSystem",
    description: "Lets members request roles from admins with one command",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "role-request", description: "Request a role", options: [{ name: "roleid", description: "Role ID to request", type: 3, required: true }, { name: "reason", description: "Reason for request", type: 3, required: false }], execute(opts: any[], ctx: any) { const roleId = opts.find((o: any) => o.name === "roleid")?.value; const reason = opts.find((o: any) => o.name === "reason")?.value || "No reason provided"; const requestable = settings.store.requestable.split(",").map((s: string) => s.trim()); if (!requestable.includes(roleId)) return { content: "That role is not requestable" }; const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id; const reqs = getRequests(); reqs.push({ userId: me, roleId, reason, guildId: ctx.guild?.id, time: new Date().toLocaleString() }); saveRequests(reqs); return { content: `Role request submitted for <@&${roleId}>. Reason: ${reason}` }; } },
        { name: "role-requests", description: "Show pending role requests (admin)", execute() { const reqs = getRequests(); if (!reqs.length) return { content: "No pending role requests" }; return { content: `**Pending Role Requests:**\n${reqs.map((r: any, i: number) => `${i+1}. <@${r.userId}> wants <@&${r.roleId}> - ${r.reason}`).join("\n")}` }; } }
    ]
});
