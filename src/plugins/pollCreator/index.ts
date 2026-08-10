import definePlugin from "@utils/types";

export default definePlugin({
    name: "PollCreator",
    description: "Create rich polls with multiple options directly in Discord",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "poll",
        description: "Create a poll",
        options: [
            { name: "question", description: "Poll question", type: 3, required: true },
            { name: "options", description: "Options separated by | e.g. Yes|No|Maybe", type: 3, required: true }
        ],
        execute(opts) {
            const question = opts.find((o: any) => o.name === "question")?.value;
            const options = opts.find((o: any) => o.name === "options")?.value?.split("|").map((s: string) => s.trim());
            const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
            const content = `**POLL: ${question}**\n\n${options.map((o: string, i: number) => `${letters[i]}. ${o}`).join("\n")}\n\nReact to vote!`;
            return { content };
        }
    }]
});
