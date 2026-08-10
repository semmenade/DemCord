import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

const PHISH_API = "https://anti-fish.bitflow.dev/check";

export default definePlugin({
    name: "AntiPhish",
    description: "Scans links against phishing databases before you click them",
    authors: [{ name: "DemCord", id: 0n }],

    flux: {
        async MESSAGE_CREATE({ message }: any) {
            const urls = message.content?.match(/https?:\/\/[^\s]+/g) || [];
            for (const url of urls) {
                try {
                    const res = await fetch(PHISH_API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: url })
                    });
                    const data = await res.json();
                    if (data.match) {
                        showNotification({
                            title: " PHISHING LINK DETECTED",
                            body: `Dangerous link detected in message!\n${url}\n\nDo NOT click this link!`,
                            color: "#f38ba8",
                            permanent: true
                        });
                    }
                } catch {}
            }
        }
    }
});

