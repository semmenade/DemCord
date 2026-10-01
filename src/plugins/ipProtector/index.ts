import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const IP_GRABBERS = ["grabify", "iplogger", "blasze", "2no.co", "yip.su", "ps3cfw.com", "yourip.me", "api.whatismyip.com", "checkip.dyndns.org"];
export default definePlugin({
    name: "IPProtector",
    description: "Blocks links that could expose your IP through tracking pixels or redirects",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        MESSAGE_CREATE({ message }: any) {
            const urls = message.content?.match(/https?:\/\/[^\s]+/g) || [];
            for (const url of urls) {
                const isGrabber = IP_GRABBERS.some(g => url.includes(g));
                if (isGrabber) {
                    showNotification({
                        title: "IP Grabber Detected",
                        body: `Potential IP grabber link detected from ${message.author?.username}: ${url}`,
                        color: "#f38ba8",
                        permanent: true
                    });
                }
            }
        }
    }
});
