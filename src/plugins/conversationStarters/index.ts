import definePlugin from "@utils/types";
const starters = [
    "What have you been up to lately?",
    "Seen anything good recently?",
    "What are you working on these days?",
    "Any big plans coming up?",
    "What games have you been playing?",
    "How has your week been going?",
    "What is something you are excited about right now?",
    "Have you tried anything new lately?",
    "What song have you had stuck in your head?",
    "What would you do with an extra day off?"
];
export default definePlugin({
    name: "ConversationStarters",
    description: "Suggests icebreaker messages when you open a DM with someone you rarely talk to",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "starter",
        description: "Get a random conversation starter",
        execute() {
            return { content: starters[Math.floor(Math.random() * starters.length)] };
        }
    }]
});
