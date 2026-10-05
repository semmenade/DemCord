import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const CHALLENGES = [
    "React to 5 messages with a heart today",
    "Start a conversation with someone you rarely talk to",
    "Share something you are grateful for in a server",
    "Give someone a genuine compliment in a DM",
    "Join a voice channel and say hello",
    "Share a funny meme in a server",
    "Reply to 3 messages you normally scroll past",
    "Use a slash command you have never used before",
    "Change your status to something creative",
    "Send a voice message instead of typing today"
];
export default definePlugin({
    name: "DailyChallenge",
    description: "Gives you a daily Discord challenge to keep things fun",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        const lastShown = localStorage.getItem("demcord-challenge-date");
        const today = new Date().toDateString();
        if (lastShown !== today) {
            localStorage.setItem("demcord-challenge-date", today);
            const challenge = CHALLENGES[new Date().getDay() % CHALLENGES.length];
            setTimeout(() => showNotification({ title: "Daily Challenge", body: challenge }), 5000);
        }
    },
    commands: [{
        name: "challenge",
        description: "Show today daily challenge",
        execute() {
            const challenge = CHALLENGES[new Date().getDay() % CHALLENGES.length];
            return { content: `**Today's Challenge:**\n${challenge}` };
        }
    }]
});
