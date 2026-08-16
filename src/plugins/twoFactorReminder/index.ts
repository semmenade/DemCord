import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "TwoFactorReminder",
    description: "Warns if your account does not have 2FA enabled",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        setTimeout(() => {
            const user = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.();
            if (user && !user.mfa_enabled) {
                showNotification({
                    title: "Security Warning",
                    body: "Your account does not have 2FA enabled. Enable it now for better security.",
                    permanent: true,
                    color: "#f38ba8",
                    onClick: () => window.open("https://discord.com/settings/security")
                });
            }
        }, 5000);
    }
});
