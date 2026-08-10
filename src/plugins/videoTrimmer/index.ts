import definePlugin from "@utils/types";
export default definePlugin({
    name: "VideoTrimmer",
    description: "Trim video clips before sending in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "trim",
        description: "Trim a video before sending",
        options: [
            { name: "start", description: "Start time in seconds", type: 10, required: true },
            { name: "end", description: "End time in seconds", type: 10, required: true }
        ],
        execute(opts) {
            const start = opts.find((o: any) => o.name === "start")?.value;
            const end = opts.find((o: any) => o.name === "end")?.value;
            return { content: `Video trimmer: ${start}s to ${end}s - attach your video file to trim` };
        }
    }]
});
