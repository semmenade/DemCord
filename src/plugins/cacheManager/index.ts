import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "CacheManager",
    description: "One click to clear Discord cache and free up RAM",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "clearcache",
        description: "Clear Discord cache",
        execute() {
            try {
                if (window.caches) window.caches.keys().then(keys => keys.forEach(k => window.caches.delete(k)));
                showNotification({ title: "CacheManager", body: "Cache cleared successfully!" });
            } catch(e) {}
            return { content: " Cache cleared!" };
        }
    }]
});

