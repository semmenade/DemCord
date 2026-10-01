import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Auto screenshot on mention", default: false }
});
export default definePlugin({
    name: "AutoScreenshot",
    description: "Automatically screenshots Discord when you get mentioned",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled) return;
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            if (!me || !message.mentions?.some((u: any) => u.id === me)) return;
            setTimeout(() => {
                const canvas = document.createElement("canvas");
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.toBlob(blob => {
                    if (!blob) return;
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `mention-${Date.now()}.png`;
                    a.click();
                    showNotification({ title: "AutoScreenshot", body: `Captured mention from ${message.author?.username}` });
                });
            }, 500);
        }
    }
});
