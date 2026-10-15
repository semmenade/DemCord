import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    unlocked: { type: OptionType.STRING, description: "Unlocked achievements", default: "[]", hidden: true },
    stats: { type: OptionType.STRING, description: "Achievement stats", default: "{}", hidden: true }
});

function getUnlocked() { try { return JSON.parse(settings.store.unlocked); } catch { return []; } }
function getStats() { try { return JSON.parse(settings.store.stats); } catch { return {}; } }
function saveStats(s: any) { settings.store.stats = JSON.stringify(s); }

const ACHIEVEMENTS = [
    { id: "first_install", name: "First Install", desc: "Install DemCord for the first time", dp: 50, check: (s: any) => true },
    { id: "plugin_hoarder", name: "Plugin Hoarder", desc: "Enable 50+ plugins", dp: 100, check: (s: any) => Object.values(DemCord?.Plugins?.plugins || {}).filter((p: any) => p.started).length >= 50 },
    { id: "daily_dedication", name: "Daily Dedication", desc: "Claim daily bonus 7 days in a row", dp: 70, check: (s: any) => s.dailyStreak >= 7 },
    { id: "chatterbox", name: "Chatterbox", desc: "Send 1000 messages", dp: 100, check: (s: any) => s.messagesSent >= 1000 },
    { id: "voice_veteran", name: "Voice Veteran", desc: "Spend 10 hours in voice", dp: 150, check: (s: any) => s.voiceMinutes >= 600 },
    { id: "theme_master", name: "Theme Master", desc: "Try all 20 DemCord themes", dp: 200, check: (s: any) => s.themesUsed >= 20 },
    { id: "marketplace_shopper", name: "Marketplace Shopper", desc: "Install 3 bundles", dp: 75, check: (s: any) => s.bundlesInstalled >= 3 },
    { id: "bundle_creator", name: "Bundle Creator", desc: "Publish your first bundle", dp: 250, check: (s: any) => s.bundlesCreated >= 1 },
    { id: "security_pro", name: "Security Pro", desc: "Enable all security plugins", dp: 100, check: (s: any) => s.securityPluginsEnabled >= 5 },
    { id: "game_mode_champion", name: "Game Mode Champion", desc: "Use game mode for 10 hours", dp: 150, check: (s: any) => s.gameModeMinutes >= 600 }
];

function unlock(achievement: any) {
    const unlocked = getUnlocked();
    if (unlocked.includes(achievement.id)) return;
    unlocked.push(achievement.id);
    settings.store.unlocked = JSON.stringify(unlocked);
    showNotification({ title: "Achievement Unlocked!", body: `${achievement.name} - +${achievement.dp} DP\n${achievement.desc}`, permanent: true });
    try {
        const { Settings } = require("@api/Settings");
        Settings.plugins.DemCordPoints ??= {};
        Settings.plugins.DemCordPoints.balance = (Settings.plugins.DemCordPoints.balance || 0) + achievement.dp;
        Settings.plugins.DemCordPoints.totalEarned = (Settings.plugins.DemCordPoints.totalEarned || 0) + achievement.dp;
    } catch {}
}

export default definePlugin({
    name: "AchievementSystem",
    description: "Full achievement system - unlock achievements and earn DP rewards",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            if (message.author?.id !== me) return;
            const s = getStats();
            s.messagesSent = (s.messagesSent || 0) + 1;
            saveStats(s);
        },
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            const s = getStats();
            s.voiceMinutes = (s.voiceMinutes || 0) + 1;
            saveStats(s);
        }
    },

    start() {
        const s = getStats();
        if (!s.firstInstall) {
            s.firstInstall = true;
            saveStats(s);
            setTimeout(() => unlock(ACHIEVEMENTS[0]), 3000);
        }
        this.interval = setInterval(() => {
            const stats = getStats();
            for (const achievement of ACHIEVEMENTS) {
                if (achievement.check(stats)) unlock(achievement);
            }
        }, 60000);
    },

    stop() { clearInterval(this.interval); },

    commands: [
        { name: "achievements", description: "Show all achievements", execute() {
            const unlocked = getUnlocked();
            const list = ACHIEVEMENTS.map(a => `${unlocked.includes(a.id) ? "DONE" : "----"} ${a.name} (+${a.dp} DP) - ${a.desc}`).join("\n");
            return { content: `**Achievements (${unlocked.length}/${ACHIEVEMENTS.length}):**\n\`\`\`\n${list}\n\`\`\`` };
        }},
        { name: "achievement-stats", description: "Show achievement progress stats", execute() {
            const s = getStats();
            const unlocked = getUnlocked();
            const totalDP = unlocked.reduce((acc: number, id: string) => acc + (ACHIEVEMENTS.find(a => a.id === id)?.dp || 0), 0);
            return { content: `**Achievement Stats:**\nUnlocked: ${unlocked.length}/${ACHIEVEMENTS.length}\nTotal DP earned: ${totalDP}\nMessages sent: ${s.messagesSent || 0}\nVoice time: ${Math.floor((s.voiceMinutes || 0) / 60)}h ${(s.voiceMinutes || 0) % 60}m` };
        }}
    ]
});
