import definePlugin from "@utils/types";
export default definePlugin({
    name: "YouTubeSync",
    description: "Share YouTube videos to watch in sync with friends",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "watch",
        description: "Share a YouTube video to watch together",
        options: [{ name: "url", description: "YouTube URL", type: 3, required: true }],
        execute(opts) {
            const url = opts.find((o: any) => o.name === "url")?.value;
            const videoId = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
            if (!videoId) return { content: "Invalid YouTube URL" };
            return { content: `Watch together: https://www.youtube.com/watch?v=${videoId}\nSync using a watch party extension for real-time sync.` };
        }
    }]
});
